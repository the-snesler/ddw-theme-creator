import { useMemo } from "react"
import { useDropzone } from "react-dropzone"
import { IoIosCheckmarkCircle } from "react-icons/io"
import { MdCancel, MdAdd } from "react-icons/md"

interface ImageDropzoneProps {
    multiple?: boolean
    onDrop: (files: File[]) => void
}

const ImageDropzone = ({ multiple, onDrop }: ImageDropzoneProps) => {
    const baseStyle: React.CSSProperties = {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 2,
        borderColor: "#DDDDDD",
        borderStyle: "dashed",
        outline: "none",
        cursor: "pointer",
        marginRight: "0.5rem",
        marginBottom: "0.5rem",
        width: "calc(100% - 0.5rem * 3)",
        height: 100,
        padding: "0.5rem",
        boxSizing: "border-box",
    }

    const acceptStyle: React.CSSProperties = { borderColor: "#00E676", color: "#00E676" }
    const rejectStyle: React.CSSProperties = { borderColor: "#FF1744", color: "#FF1744" }

    const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
        accept: { "image/*": [".bmp", ".gif", ".jpg", ".jpeg", ".png", ".tiff"] },
        multiple: multiple ?? false,
        onDrop: (acceptedFiles) => {
            onDrop(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })))
        },
    })

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
    }), [isDragReject, isDragAccept])

    return (
        <div className="dropzone hover-fade">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                {isDragAccept && <IoIosCheckmarkCircle className="dropzone-caption-icon" />}
                {isDragReject && <MdCancel className="dropzone-caption-icon" />}
                {!isDragAccept && !isDragReject && <MdAdd className="dropzone-caption-icon" />}
            </div>
        </div>
    )
}

export default ImageDropzone
