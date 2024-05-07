import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BASE from '../BASE/base.js';

function draw(_thisChartView) {
    let _container = BASE.createContainer(_thisChartView);
    let _scene = BASE.createScene();
    let _camera = BASE.createCamera(_container);
    let _renderer = BASE.createRenderer(_container);

    createModel(_scene);

    BASE.creatLightD(_scene);
    BASE.creatAmbient(_scene);

    BASE.createRenderDom(_container, _renderer);

    BASE.rotateCamera(_scene, _camera, _renderer);
    BASE.orbitControls(_scene, _camera, _renderer);
}

function createModel(_scene) {
    let loader = new GLTFLoader();
    let dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath(BASE.decodeDracoPath);
    loader.setDRACOLoader(dracoLoader);

    loader.load('./static/plugins/js/threejs/examples/models/gltf/kira.glb',
        function (gltf) {
            let root = gltf.scene;
            _scene.add(root);
        });
}

export { draw };
