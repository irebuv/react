<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            //'rating' => 'required|numeric|min:0',
            //'featured_image' => 'nullable|mimes:png,jpg,gif,jpeg,JPEG,PNG,JPG,webp',
            //'files' => 'nullable|array',
            //'files.*' => 'nullable|mimes:png,jpg,gif,jpeg,JPEG,PNG,JPG',
        ];
    }
}
