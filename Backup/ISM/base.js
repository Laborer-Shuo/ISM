import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

let decodeDracoPath = '/static/plugins/js/threejs/examples/jsm/libs/draco/';

//-----------------------------------------

function createContainer(
    _thisChartView,
    _id = 'MyCanvas',
    _backColor = "transparent") {

    let _container = $("<div>");

    let _target = $('[_echarts_instance_=' + _thisChartView.id + ']');
    let _father = _target.parent().parent().parent().parent();

    _container.attr("id", _id);
    _container.css({
        "width": _father.css("width"),
        "height": _father.css("height"),
        "background-color": _backColor,
        "position": "fixed",
        "top": "0px",
        "left": "0px",
        "z-index": '800'
    });

    _father.append(_container);

    return _container;
}

//-----------------------------------------

function createScene() {
    let _scene = new THREE.Scene();
    return _scene;
}

//-----------------------------------------

function createCamera(
    _container, _fov = 75, _near = 0.5, _far = 1000,
    _x = 0, _y = 1.5, _z = 5) {
    let _ratio = calcCameraRatio(_container);
    let _camera = new THREE.PerspectiveCamera(_fov, _ratio, _near, _far);
    _camera.position.x = _x;
    _camera.position.y = _y;
    _camera.position.z = _z;

    return _camera;
}

//-----------------------------------------

function createRenderer(_container) {

    let _renderer = new THREE.WebGLRenderer({ alpha: true });
    _renderer.setSize(_container.width(), _container.height());

    return _renderer;
}

//-----------------------------------------

function creatLightD(
    _scene, _color = 0xffffff, _strength = 1,
    _x = 100, _y = 60, _z = 50) {

    let _light = new THREE.DirectionalLight(_color, _strength);
    _light.position.set(_x, _y, _z);
    _light.castShadow = true;
    _scene.add(_light);

    return _light;
}

//-----------------------------------------

function creatAmbient(
    _scene, _color = 0xffffff, _strength = 0.8) {

    let _ambient = new THREE.AmbientLight(_color, _strength);
    _scene.add(_ambient);

    return _ambient;
}

//-----------------------------------------

function createRenderDom(_container, _renderer) {

    let _renderDom = $(_renderer.domElement);
    _renderDom.css({
        "width": _container.css("width"),
        "height": _container.css("height"),
        "z-index": "900"
    });

    _container.append(_renderDom);

    return _renderDom;
}

//-----------------------------------------

function createLabel(
    _container, _attachMesh, _labelText, _labelId = 'Css2Label',
    _backColor = 'transparent', _fontColor = 'yellow', _fontSize = '20px',
    _x = 0, _y = 0.6, _z = 0, _centerX = 0, _centerY = 1) {

    let _css2Div = $('<div>');
    _css2Div.attr('id', _labelId);
    _css2Div.attr('class', 'Class_' + _labelId);
    _css2Div.text(_labelText);
    _css2Div.css({
        'background-color': _backColor,
        'color': _fontColor,
        'font-size': _fontSize,
        'position': 'relative',
        'display': 'inline-block',
        'border-bottom': '1px dotted black'
    });

    let _css2Label = new CSS2DObject(_css2Div.get(0));
    _css2Label.position.set(_x, _y, _z);
    _css2Label.center.set(_centerX, _centerY);
    _attachMesh.add(_css2Label);

    let _css2Renderer = new CSS2DRenderer();
    _css2Renderer.setSize(_container.width(), _container.height());
    $(_css2Renderer.domElement).css({
        'position': 'absolute',
        'top': '0px',
        'z-index': '-1'
    });
    _container.append($(_css2Renderer.domElement));

    return { _css2Div, _css2Renderer };
}

//-----------------------------------------

function rotateCamera(
    _scene, _camera, _renderer,
    _axis = 'y', _speed = 0.01) {

    function rotate() {
        switch (_axis.toLowerCase()) {
            case 'x':
                _scene.rotation.x += _speed;
                break;
            case 'y':
                _scene.rotation.y += _speed;
                break;
            case 'z':
                _scene.rotation.z += _speed;
                break;
            default:
                break;
        }
        requestAnimationFrame(rotate);
        _renderer.render(_scene, _camera);
    }
    rotate();
}

//-----------------------------------------

function orbitControls(_scene, _camera, _renderer) {

    let _controls = new OrbitControls(_camera, _renderer.domElement);
    _controls.addEventListener('change', function () {
        _renderer.render(_scene, _camera);
    });
}

//-----------------------------------------

function createInfoBox(
    _target, _text = "info", _color = "#FFF") {

    let _span = $("<span>");
    let _div = $("<div>");

    _span.css({
        'width': '120px',
        'background-color': '#555',
        'color': _color,
        'text-align': 'center',
        'padding': '5px 0',
        'border-radius': '6px',
        'position': 'absolute',
        'z-index': '100',
        'bottom': '125%',
        'left': '50%',
        'margin-left': '-60px',
        'transition': 'opacity 0.3s'
    });

    _div.css({
        'position': 'absolute',
        'top': '100%',
        'left': '50%',
        'margin-left': '-5px',
        'border-width': '5px',
        'border-style': 'solid',
        'border-color': '#555 transparent transparent transparent'
    });

    _span.text(_text);

    _span.append(_div);
    _target.append(_span);
}

//-----------------------------------------

function calcCameraRatio(_container) {
    let _width = _container.width();
    let _height = _container.height()
    let _ratio = _width / _height;
    return _ratio;
}

//-----------------------------------------

export {
    decodeDracoPath,

    //-----------------------------------------

    createContainer,
    createScene,
    createCamera,
    createRenderer,
    createRenderDom,

    creatAmbient,
    creatLightD,

    createInfoBox,
    createLabel,

    rotateCamera,
    orbitControls
};
