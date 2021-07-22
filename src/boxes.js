import React from "react"
import { Stage, Layer, Rect, Transformer, Text, Group } from "react-konva"
import URLImage from "./url-image"
import PdfView from "./load-quixote"
import "./boxes.css"

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef()
  const trRef = React.useRef()
  const textColour = shapeProps.color ? shapeProps.color : "white"
  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  return (
    <React.Fragment>
      <Group
        onClick={onSelect}
        onTap={onSelect}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps
            // x: e.target.x() < 500 ? e.target.x() : 20,
            // y: e.target.y() < 800 ? e.target.y() : 50
          })
        }}
      >
        <Rect
          ref={shapeRef}
          {...shapeProps}
          stroke="black"
          strokeWidth={1}
          onTransformEnd={(e) => {
            // transformer is changing scale of the node
            // and NOT its width or height
            // but in the store we have only width and height
            // to match the data better we will reset scale on transform end
            const node = shapeRef.current
            const scaleX = node.scaleX()
            const scaleY = node.scaleY()

            // we will reset it back
            node.scaleX(1)
            node.scaleY(1)
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY)
            })
          }}
        />
        <Text
          text={shapeProps.name}
          x={shapeProps.x + 30}
          y={shapeProps.y - 5 + shapeProps.height / 2}
          fontSize={18}
          fontFamily="Arial"
          fill={textColour}
        ></Text>
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </React.Fragment>
  )
}

const initialRectangles = [
  {
    x: 35,
    y: 35,
    width: 100,
    height: 50,
    fill: "#b5cef5",
    id: "cus1",
    color: "navy",
    name: "Mike"
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 50,
    fill: "#d0f5d2",
    id: "cus2",
    name: "Jo",
    color: "black"
    // shadowBlur: 10,
    // cornerRadius: 10
  },
  {
    x: 270,
    y: 150,
    width: 100,
    height: 50,
    fill: "#f2c9f1",
    id: "pm",
    color: "darkgreen",
    name: "Jelena"
  }
]

const Boxes = () => {
  const [rectangles, setRectangles] = React.useState(initialRectangles)
  const [selectedId, selectShape] = React.useState(null)
  const [bgImage, setBG] = React.useState("/invoice.png")
  const canvasRef = React.useRef()
  const [width, height] = [595, 845]
  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      selectShape(null)
    }
  }

  const getImg = (page) => {
    const c = document.getElementsByClassName("react-pdf__Page__canvas")
    console.log(c[page - 1])
    if (c && c.length) {
      const img = c[page - 1].toDataURL()
      console.log(img)
      setBG(img)
    }
  }

  return (
    <div style={{ background: "#eee", height: "100%" }}>
      <Stage
        width={width + 50}
        height={height + 50}
        draggable
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        opacity={1}
        fill="#fff"
      >
        <Layer ref={canvasRef} style={{ background: "#f00" }} opacity={1}>
          <URLImage
            src={bgImage}
            x={25}
            y={25}
            width={width}
            height={height}
            scaleX={1}
            scaleY={1}
          />
          <Rect
            x={25}
            y={25}
            width={width}
            height={height}
            opacity={1}
            stroke="#444"
            strokeWidth={1}
          ></Rect>
          {rectangles.map((rect, i) => {
            return (
              <React.Fragment key={i}>
                <Rectangle
                  key={i}
                  shapeProps={rect}
                  isSelected={rect.id === selectedId}
                  onSelect={() => {
                    selectShape(rect.id)
                  }}
                  onChange={(newAttrs) => {
                    const rects = rectangles.slice()
                    rects[i] = newAttrs
                    setRectangles(rects)
                  }}
                ></Rectangle>
                {/* <Text
                  text={rect.name}
                  x={rect.x + 30}
                  y={rect.y - 5 + rect.height / 2}
                ></Text> */}
              </React.Fragment>
            )
          })}
        </Layer>
      </Stage>
      <button onClick={() => getImg(1)}>Grab page 1</button>&nbsp;
      <button onClick={() => getImg(2)}>Grab page 2</button>
      <button onClick={() => getImg(3)}>Grab page 3</button>
      <PdfView
        style={{
          width: width + 100,
          height: height + 100
        }}
      ></PdfView>
    </div>
  )
}

export default Boxes
