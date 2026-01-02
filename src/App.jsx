import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Experience from './components/Experience';
import Overlay from './components/Overlay';
import MagneticCursor from './components/MagneticCursor';
import FilmGrain from './components/FilmGrain';

function App() {
  return (
    <Layout>
      <Navbar />
      <MagneticCursor />
      <FilmGrain />
      <Experience />
      <Overlay />
    </Layout>
  );
}

export default App;
