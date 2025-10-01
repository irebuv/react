<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BusinessController extends Controller
{
    public function index(Request $request)
    {
        $myProjects = $request->input('myProjects', 0);
        $type = $request->input('type', 'all');
        if ($type == 'all') {
            $type = false;
        }
        $businesses = Business::with('user')
            ->when($myProjects, fn($q) => $q->where('user_id', $request->user()->id))
            ->when($type, fn($q) => $q->where('type', $type))
            ->orderByDesc('id')
            ->paginate(8)
            ->withQueryString();
        $types = Cache::remember('business_types', 10080, function () {
            return Business::distinct()->pluck('type');
        });
        $myRequests = Order::query()
            ->select('orders.*', 'businesses.name as business_name', 'businesses.image as business_image')
            ->join('businesses', 'orders.business_id', '=', 'businesses.id')
            ->whereHas('business', fn($q) => $q
            ->where('user_id', auth()->user()->id))
            ->orderBy('created_at', 'desc')
            ->get();
        $unreadCount = $myRequests->where('is_read', false)->count();
        return Inertia::render('app/business/business',
            compact('businesses', 'myProjects', 'types', 'myRequests', 'unreadCount'));
    }

    public function request(Request $request)
    {
        $request->validate([
            'request_name' => 'required|string|max:255',
            'request_description' => 'required|string',
            'date' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
        ]);
        $order = Order::create([
            "name" => $request->request_name,
            "description" => $request->request_description,
            "date" => $request->date,
            "phone" => $request->phone,
            "business_id" => $request->id,
        ]);

        if ($order) {
            return redirect()->route("business.index")->with("success", "Your request added successfully! We feedback you soon!");
        }
        return redirect()->back()->with("error", 'Filed to create request!');

    }

    public function markAsRead(Request $request)
    {
        Order::whereHas('business', function ($q) {
            $q->where('user_id', auth()->id());
        })
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return back();
    }

    public function store(Request $request)
    {
        if (!auth()->user()) {
            return redirect()->back()->with("error", 'You not authorized to create a project!');
        }
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            //'image' => 'nullable|mimes:png,jpg,gif,jpeg,JPEG,PNG,JPG,webp',
        ]);
        try {
            $ImagePath = null;

            $folders = date('Y') . '/' . date('m') . '/' . date('d');
            if ($request->hasFile('image')) {
                $ImagePath = $request->file("image")->store("images/businesses/{$folders}", "public");
            }

            $business = Business::create([
                "name" => $request->name,
                "description" => $request->description,
                "image" => $ImagePath,
                "type" => $request->type,
                "user_id" => $request->user()->id,
            ]);

            if ($business) {
                return redirect()->route("business.index")->with("success", "Your project added successfully!");
            }
            return redirect()->back()->with("error", 'Filed to create project');
        } catch (\Exception $e) {
            return redirect()->back()->with("error", 'Filed to create project');
        }
    }

    public function update(Request $request, Business $business)
    {
        if (!auth()->user()) {
            return redirect()->back()->with("error", 'You not authorized to create a project!');
        }
        if ($business && $business->user_id === auth()->id()) {
            try {
                if ($image = $request->file('image')) {
                    if ($business->image) {
                        Storage::disk('public')->delete($business->image);
                    }
                    $folders = date('Y') . '/' . date('m') . '/' . date('d');
                    $image = $image->store("images/businesses/{$folders}", 'public');
                    $business->image = $image;
                }
                $business->name = $request->name;
                $business->description = $request->description;
                $business->type = $request->type;
                $business->save();
                return redirect()->back()->with('success', 'Project updated successfully!');
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                return redirect()->back()->with("error", 'Filed to edit project');
            }
        } else {
            return redirect()->back()->with("error", 'Filed to edit project');
        }
    }

    public function destroy(Business $business)
    {
        if ($business && ($business->user_id === auth()->id())) {
            $business->delete();
            return redirect()->back()->with('success', 'Project was deleted!');
        } else {
            return redirect()->back()->with('error', 'Unable to delete project!');
        }
    }
}
