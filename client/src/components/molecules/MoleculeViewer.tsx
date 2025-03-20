import { useEffect, useRef } from "react";

interface MoleculeViewerProps {
  pdbId?: string;
  smilesString?: string;
}

const MoleculeViewer = ({ pdbId, smilesString }: MoleculeViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    // Load 3Dmol.js dynamically
    const script = document.createElement('script');
    script.src = 'https://3dmol.org/build/3Dmol-min.js';
    script.async = true;
    script.onload = initViewer;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [pdbId, smilesString]);

  const initViewer = () => {
    if (typeof window.$3Dmol === 'undefined' || !viewerRef.current) return;

    // Clear any previous content
    viewerRef.current.innerHTML = '';

    // Create viewer
    const viewer = window.$3Dmol.createViewer(viewerRef.current, {
      backgroundColor: 'black',
      antialias: true,
    });

    if (pdbId) {
      // Load PDB data
      window.$3Dmol.download(`pdb:${pdbId}`, viewer, {}, () => {
        viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
        viewer.zoomTo();
        viewer.render();
      });
    } else if (smilesString) {
      // Load from SMILES using SDF format
      const source = `data:chemical/smiles,${encodeURIComponent(smilesString)}`;
      viewer.addModel(smilesString, "smi");
      viewer.setStyle({}, { stick: {} });
      viewer.zoomTo();
      viewer.render();
    } else {
      // Default visualization - placeholder TNF receptor
      window.$3Dmol.download('pdb:1TNF', viewer, {}, () => {
        viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
        viewer.zoomTo();
        viewer.render();
      });
    }
  };

  return (
    <div className="molecular-viewer h-48 flex items-center justify-center" ref={viewerRef}>
      <div className="text-white text-opacity-70 text-center">
        <i className="ri-cube-line text-4xl mb-2 block"></i>
        <span className="text-sm">Interactive 3D Structure</span>
      </div>
    </div>
  );
};

export default MoleculeViewer;
