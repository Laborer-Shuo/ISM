import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BASE from '../BASE/base.js';

function draw(_thisChartView) {
    let _container = BASE.createContainer(_thisChartView);
    let _scene = BASE.createScene();
    let _camera = BASE.createCamera(_container);
    let _renderer = BASE.createRenderer(_container);

    createModel(_scene, _camera);

    BASE.creatLightD(_scene);
    BASE.creatAmbient(_scene);

    BASE.createRenderDom(_container, _renderer);

    BASE.rotateCamera(_scene, _camera, _renderer);
    BASE.orbitControls(_scene, _camera, _renderer);
    BASE.updateCamNModel(_camera, _renderer);
    BASE.autoAjustCanvas(_scene, _camera, _renderer);
}

function createModel(_scene, _camera) {
    let loader = new GLTFLoader();
    let dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath(BASE.decodeDracoPath);
    loader.setDRACOLoader(dracoLoader);

    loader.load('./static/plugins/js/threejs/examples/models/gltf/kira.glb',
        function (gltf) {
            let root = gltf.scene;
            _scene.add(root);
            adjustCamPosition(root, _camera);
        });
}

//-----------------------------------------

//相机位置自适应
function adjustCamPosition(root, _camera) {
    let boundingBox = new THREE.Box3().setFromObject(root);
    let center = boundingBox.getCenter(new THREE.Vector3());
    let size = boundingBox.getSize(new THREE.Vector3());
    let distance = Math.max(size.x, size.y, size.z) * 3;
    let fov = _camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((distance / 2) / Math.tan(fov / 2));


    _camera.position.set(center.x, center.y, cameraZ);
    _camera.lookAt(center);


    BASE._controls.target.set(center.x, center.y, center.z);
    BASE._controls.update();
}

export { draw };
