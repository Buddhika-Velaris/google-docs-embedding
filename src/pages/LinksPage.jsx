import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGoogleDocType, extractSpreadsheetId, extractDocumentId } from '../services/googleAuth';

const LinksPage = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('links');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Sync links to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('links', JSON.stringify(links));
  }, [links]);

  const handleUrlChange = (e) => setInputUrl(e.target.value);

  const handleAddLink = (e) => {
    e.preventDefault();
    if (inputUrl) {
      setLinks([...links, inputUrl]);
      setInputUrl('');
    }
  };

  return (
    <div>
      <h1>Manage Google Docs/Sheets Links</h1>
      <form onSubmit={handleAddLink}>
        <input
          type="text"
          placeholder="Enter Google Docs or Sheets URL"
          value={inputUrl}
          onChange={handleUrlChange}
          style={{ width: '400px' }}
        />
        <button type="submit">Add Link</button>
      </form>
      <ul>
        {links.map((link, index) => {
          const type = getGoogleDocType(link);
          let id = null;
          if (type === 'sheet') id = extractSpreadsheetId(link);
          else if (type === 'document') id = extractDocumentId(link);
          return (
            <li key={index}>
              {type && id ? (
                <Link to={`/viewer/${type}/${id}`}>{link}</Link>
              ) : (
                <span style={{ color: 'red' }}>Invalid URL: {link}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LinksPage;
