"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Transformer,
  Text,
  Group,
} from "react-konva";
import useImage from "use-image";
import { MdDelete } from "react-icons/md";
import { FaDownload } from "react-icons/fa6";

const ShirtDesigner = () => {
  const [designUrl, setDesignUrl] = useState(null);
  const [design, setDesign] = useState(null);
  const [text, setText] = useState("");
  const [texts, setTexts] = useState([]);
  const [textColor, setTextColor] = useState("#ffff");
  const [shirtImage] = useImage("/shirt.png"); // Ensure the path is correct
  const [uploadedImage] = useImage(designUrl);
  const [deleteIcon] = useImage(<MdDelete />); // Ensure the path is correct
  const imageRef = useRef();
  const transformerRef = useRef();
  const stageRef = useRef();
  const [selectedTextIndex, setSelectedTextIndex] = useState(null);
  const selectedTextRef = useRef();

  useEffect(() => {
    if (transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [uploadedImage]);

  useEffect(() => {
    if (selectedTextIndex !== null && transformerRef.current) {
      transformerRef.current.nodes([selectedTextRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedTextIndex]);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setDesignUrl(reader.result);
      setDesign({ x: 150, y: 150, width: 100, height: 100 });
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnd = (e) => {
    setDesign({
      ...design,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = () => {
    const node = imageRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset the scale
    node.scaleX(1);
    node.scaleY(1);

    setDesign({
      ...design,
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });
  };

  const handleTextDragEnd = (e, index) => {
    const newTexts = texts.slice();
    newTexts[index] = {
      ...newTexts[index],
      x: e.target.x(),
      y: e.target.y(),
    };
    setTexts(newTexts);
  };

  const handleTextTransformEnd = (index) => {
    const node = selectedTextRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset the scale
    node.scaleX(1);
    node.scaleY(1);

    const newTexts = texts.slice();
    newTexts[index] = {
      ...newTexts[index],
      x: node.x(),
      y: node.y(),
      fontSize: node.fontSize() * scaleY,
      width: node.width() * scaleX,
      height: node.height() * scaleY,
    };
    setTexts(newTexts);
  };

  const handleAddText = () => {
    setTexts([
      ...texts,
      { text, x: 150, y: 150, fontSize: 24, color: textColor },
    ]);
    setText("");
  };

  const handleDeleteText = (index) => {
    const newTexts = texts.slice();
    newTexts.splice(index, 1);
    setTexts(newTexts);
    setSelectedTextIndex(null);
  };

  const handleSave = () => {
    // Temporarily hide the transformer
    if (transformerRef.current) {
      transformerRef.current.nodes([]); // Clear nodes to hide the transformer
      transformerRef.current.getLayer().batchDraw();
    }

    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "design.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (transformerRef.current && selectedTextIndex !== null) {
      transformerRef.current.nodes([selectedTextRef.current]); // Reset selected node
      transformerRef.current.getLayer().batchDraw();
    }
  };

  return (
    <div className="flex max-md:flex-wrap  w-full  bg-[#fff97e]">
      <div className="flex-col w-full p-10 mt-16">
        <h1 className=" text-[70px] font-bold text-black">Create Your On</h1>
        <h1 className="text-[70px] font-bold text-red-600">Design</h1>
        <input type="file" onChange={handleUpload} className="p-3 bg-black text-white mt-5 rounded-lg shadow-lg w-96"/>
        <br></br>
        <input
        className="p-3 mt-5 rounded-lg shadow-md w-96"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add text"
        />
        <br />
       
        <input
        
          placeholder=""
          className="ml-3 rounded-lg h-12 mt-5"
          type="color"
          value={textColor}
          
          onChange={(e) => setTextColor(e.target.value)}
        />
        <button onClick={handleAddText} className="p-2 rounded-lg mb-2 flex justify-center items-center bg-black font-bold text-white ">Add Text</button>
      </div>

      <div className=" flex-col flex justify-center items-center bg-[#86fddf] w-full ">
        <Stage width={500} height={600} ref={stageRef} id={"stage"}>
          <Layer>
            {shirtImage && (
              <KonvaImage image={shirtImage} width={500} height={600} />
            )}
            {design && uploadedImage && (
              <>
                <KonvaImage
                  image={uploadedImage}
                  x={design.x}
                  y={design.y}
                  width={design.width}
                  height={design.height}
                  draggable
                  ref={imageRef}
                  onDragEnd={handleDragEnd}
                  onTransformEnd={handleTransformEnd}
                />
                <Transformer
                  ref={transformerRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    // limit resize
                    if (newBox.width < 5 || newBox.height < 5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              </>
            )}
            {texts.map((textItem, index) => (
              <Group key={index}>
                <Text
                  ref={index === selectedTextIndex ? selectedTextRef : null}
                  text={textItem.text}
                  x={textItem.x}
                  y={textItem.y}
                  fontSize={textItem.fontSize}
                  fill={textItem.color}
                  draggable
                  onClick={() => setSelectedTextIndex(index)}
                  onTap={() => setSelectedTextIndex(index)}
                  onDragEnd={(e) => handleTextDragEnd(e, index)}
                  onTransformEnd={() => handleTextTransformEnd(index)}
                />
                {index === selectedTextIndex && (
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 5 || newBox.height < 5) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                )}
                {index === selectedTextIndex && deleteIcon && (
                  <KonvaImage
                    x={textItem.x + textItem.width / 2 - 10}
                    y={textItem.y + textItem.height / 2 - 10}
                    image={deleteIcon}
                    width={40}
                    height={40}
                    onClick={() => handleDeleteText(index)}
                    onTap={() => handleDeleteText(index)}
                  />
                )}
              </Group>
            ))}
          </Layer>
        </Stage>
        <button
          className="p-4 rounded-lg mb-2 flex justify-center items-center bg-green-500 font-bold text-white "
          onClick={handleSave}
        >
          Download{" "}
          <span className="inline-block ml-2">
            <FaDownload />
          </span>
        </button>
      </div>
    </div>
  );
};

export default ShirtDesigner;
