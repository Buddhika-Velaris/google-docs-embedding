import { useParams } from 'react-router-dom';
import GoogleDocViewer from '../components/GoogleDocViewer';

const ViewerPage = () => {
  const { type, id } = useParams();
  return <GoogleDocViewer initialDocType={type} initialDocId={id} />;
};

export default ViewerPage;
