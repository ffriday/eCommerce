import { jsonData } from './testData';

export default function Notfound() {
  return <img src={jsonData.masterData.current.masterVariant.images[0].url} alt='Product card' />;
}
