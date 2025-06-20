import { useState } from "react"
import Cropper from "react-easy-crop"


const Demo = () => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)


    return (
        <div>

            <div className="w-[480px] h-[300px] relative">

                <Cropper
                    image="http://picsum.photos/800/600"
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    zoomSpeed={0.1}
                />
            </div>
        </div>
    )
}


export default Demo