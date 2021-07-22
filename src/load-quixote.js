import React, { useState } from "react"
import { Document, Page } from "react-pdf/dist/esm/entry.webpack"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"

import "./quixote.css"

const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true
}

export default function Sample() {
  const [file, setFile] = useState("/pdf/quixote.pdf")
  const [numPages, setNumPages] = useState(null)
  const [width, height] = [600, 800]

  function onFileChange(event) {
    setFile(event.target.files[0])
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages)
  }

  return (
    <div className="Example">
      <div className="Example__container">
        <div className="Example__container__load">
          <label htmlFor="file">Load from file:</label>{" "}
          <input onChange={onFileChange} type="file" />
        </div>
        <div className="Example__container__document">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
            style={{
              width: width + 100,
              height: height + 100
            }}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      </div>
    </div>
  )
}
