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

    let { _css2Div, _css2Renderer } =
        BASE.createLabel(
            _container,
            _scene.getObjectByName("model2"),
            'Hello!-\u6D4B\u8BD5');
    BASE.createInfoBox(_css2Div, '\u6D4B\u8BD5');

    BASE.rotateCamera(_scene, _camera, _renderer);
    BASE.orbitControls(_scene, _camera, _renderer);

    function rotate() {
        requestAnimationFrame(rotate);
        _css2Renderer.render(_scene, _camera);
    }
    rotate();
}

function createModel(_scene) {

    let _geometry = new THREE.BoxGeometry(1, 1, 1);
    let _material = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.8
    });

    let _model = new THREE.Mesh(_geometry, _material);
    _model.receiveShadow = true;
    _model.castShadow = true;

    for (let i = 0; i < 5; i++) {
        let _tmpModel = _model.clone();
        _tmpModel.name = 'model' + i;
        _tmpModel.position.x = 1.2 * i;
        _scene.add(_tmpModel);
    }
}

export { draw };
