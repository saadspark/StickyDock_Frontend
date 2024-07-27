'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Text, Group } from 'react-konva';
import useImage from 'use-image';
import { FaTrashAlt } from 'react-icons/fa';

const ShirtDesigner = () => {
  const [designUrl, setDesignUrl] = useState(null);
  const [design, setDesign] = useState(null);
  const [text, setText] = useState('');
  const [texts, setTexts] = useState([]);
  const [textColor, setTextColor] = useState('#000000');
  const [shirtImage] = useImage('/shirt.png'); // Ensure the path is correct
  const [uploadedImage] = useImage(designUrl);
  const [deleteIcon] = useImage('/shirt.png'); // Ensure the path is correct
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
    setTexts([...texts, { text, x: 150, y: 150, fontSize: 24, color: textColor }]);
    setText('');
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
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show the transformer again after saving
    if (transformerRef.current && selectedTextIndex !== null) {
      transformerRef.current.nodes([selectedTextRef.current]); // Reset selected node
      transformerRef.current.getLayer().batchDraw();
    }
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add text"
      />
      <input
        type="color"
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
      />
      <button onClick={handleAddText}>Add Text</button>
      <Stage width={500} height={600} ref={stageRef}>
        <Layer>
          {shirtImage && (
            <KonvaImage
              image={shirtImage}
              width={500}
              height={600}
            />
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
                  width={20}
                  height={20}
                  onClick={() => handleDeleteText(index)}
                  onTap={() => handleDeleteText(index)}
                />
              )}
            </Group>
          ))}
        </Layer>
      </Stage>
      <button onClick={handleSave}>Save Design</button>
    </div>
  );
};

export default ShirtDesigner;
