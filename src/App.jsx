import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Experience from './components/Experience';
import Overlay from './components/Overlay';
import MagneticCursor from './components/MagneticCursor';
import FilmGrain from './components/FilmGrain';
import StoryScroller from './components/StoryScroller';

function App() {
  return (
    <Layout>
      <StoryScroller />
      <Navbar />
      <MagneticCursor />
      <FilmGrain />
      <Experience />
      <Overlay />
    </Layout>
  );
}

export default App;
