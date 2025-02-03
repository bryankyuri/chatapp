import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // For accessibility

const FilePreviewer = ({ fileUrl, onClose }) => {
  const [pdfPages, setPdfPages] = useState([]);
  const [docText, setDocText] = useState('');
  const [excelData, setExcelData] = useState([]);
  
  const fetchFile = async () => {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const file = new File([blob], fileUrl.split('/').pop());

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    if (fileExtension === 'pdf') {
      reader.onload = () => {
        const uint8Array = new Uint8Array(reader.result);
        setPdfPages([uint8Array]);
      };
      reader.readAsArrayBuffer(file);
    }

    if (fileExtension === 'docx') {
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        setDocText(result.value);
      };
      reader.readAsArrayBuffer(file);
    }

    if (fileExtension === 'xlsx') {
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        setExcelData(data);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  React.useEffect(() => {
    fetchFile();
  }, [fileUrl]);

  const renderPreview = () => {
    const fileExtension = fileUrl.split('.').pop().toLowerCase();

    if (fileExtension === 'pdf') {
      return (
        <div>
          {pdfPages.map((pageData, index) => (
            <Document file={pageData} key={index}>
              <Page pageNumber={index + 1} />
            </Document>
          ))}
        </div>
      );
    }

    if (fileExtension === 'docx') {
      return <div><pre>{docText}</pre></div>;
    }

    if (fileExtension === 'xlsx') {
      return (
        <div>
          <table>
            <thead>
              <tr>
                {excelData[0] && excelData[0].map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.slice(1).map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return <div>File type not supported</div>;
  };

  return (
    <Modal isOpen={true} onRequestClose={onClose} contentLabel="File Preview" className="modal" overlayClassName="overlay">
      <h3>Document Preview</h3>
      {renderPreview()}
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export const TestPage = () => {
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const documents = [
    { name: 'Sample PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { name: 'Sample DOCX', url: 'https://example.com/sample.docx' },
    { name: 'Sample XLSX', url: 'https://example.com/sample.xlsx' },
  ];

  const openModal = (url) => {
    setSelectedFileUrl(url);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <h1>Document List</h1>
      <ul>
        {documents.map((doc, index) => (
          <li key={index}>
            <button onClick={() => openModal(doc.url)}>{doc.name}</button>
          </li>
        ))}
      </ul>

      {modalIsOpen && <FilePreviewer fileUrl={selectedFileUrl} onClose={closeModal} />}
    </div>
  );
};

export default TestPage;