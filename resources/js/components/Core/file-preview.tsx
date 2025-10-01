import { X } from "lucide-react"

interface PreviewProps {
    files: File[]
    previewUrls: string[]
    onRemove: (index: number) => void
}

export default function FilePreview({ files, previewUrls, onRemove }: PreviewProps) {

    if (!files || files.length === 0) return null

    return (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {previewUrls.map((file, index) => {
                const url = previewUrls[index]


                if (url) {
                    return (
                        <div
                            key={index}
                            className="relative flex flex-col items-center rounded-md
                             border border-gray-300 bg-white p-2 shadow-md"
                        >
                            <button
                                type="button"
                                className="absolute top-1 right-1 cursor-pointer
                                 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                onClick={() => onRemove(index)}
                            >
                                <X size={14} />
                            </button>
                            <img
                                src={url}
                                alt={`preview-${index}`}
                                className="h-32 w-32 rounded-md object-cover"
                            />
                        </div>
                    )
                }


                return (
                    <div
                        key={index}
                        className="relative flex flex-col items-center rounded-md
                         border border-gray-300 bg-white p-2 shadow-md"
                    >
                        <button
                            type="button"
                            className="absolute top-1 right-1 cursor-pointer
                             rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                            onClick={() => onRemove(index)}
                        >
                            <X size={14} />
                        </button>
                        <span>{file.name}</span>
                    </div>
                )
            })}
        </div>
    )
}
{/* For non images - files */}
{/*{data.files.length > 0 && data.files.some((_, index) => !previewUrls[index]) && (*/}
{/*    <div className="mt-3 grid grid-cols-1 gap-2">*/}
{/*        {data.files.map((file: File, index: number) =>*/}
{/*            !previewUrls[index] ? (*/}
{/*                <div*/}
{/*                    key={index}*/}
{/*                    className="relative flex flex-col items-center rounded-md border border-gray-300 bg-white p-2 shadow-md"*/}
{/*                >*/}
{/*                    /!* Button to remove selected image *!/*/}
{/*                    <button*/}
{/*                        type="button"*/}
{/*                        className="absolute top-1 right-1 cursor-pointer rounded-full bg-red-500 p-1 text-white hover:bg-red-600"*/}
{/*                        onClick={() => handleRemove(index)}*/}
{/*                    >*/}
{/*                        <X size={14} />*/}
{/*                    </button>*/}

{/*                    <span>{file.name}</span>*/}
{/*                </div>*/}
{/*            ) : null*/}
{/*        )}*/}
{/*    </div>*/}
{/*)}*/}

{/* file preview */}
{/*{data.files.length > 0 && previewUrls.length > 0 && (*/}
{/*    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">*/}
{/*        {data.files.map((file: File, index: number) =>*/}
{/*            previewUrls[index] ? (*/}
{/*                <div*/}
{/*                    key={index}*/}
{/*                    className="relative flex flex-col items-center rounded-md border border-gray-300 bg-white p-2 shadow-md"*/}
{/*                >*/}
{/*                    /!* Button to remove selected image *!/*/}
{/*                    <button*/}
{/*                        type="button"*/}
{/*                        className="absolute top-1 right-1 cursor-pointer rounded-full bg-red-500 p-1 text-white hover:bg-red-600"*/}
{/*                        onClick={() => handleRemove(index)}*/}
{/*                    >*/}
{/*                        <X size={14} />*/}
{/*                    </button>*/}

{/*                    <img*/}
{/*                        src={previewUrls[index] as string}*/}
{/*                        alt={`preview-${index}`}*/}
{/*                        className="h-32 w-32 rounded-md object-cover"*/}
{/*                    />*/}
{/*                </div>*/}
{/*            ) : null*/}
{/*        )}*/}
{/*    </div>*/}
{/*)}*/}
