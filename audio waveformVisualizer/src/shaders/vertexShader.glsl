
// Uniform array for frequency data
uniform float vData[128]; // Adjust size based on `bufferLength`
varying float x;
varying float y;
varying float z;
varying vec3 vUv;

void main(){
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
         vUv = position;
        x = abs(position.x);
	      y = abs(position.y);

        float floor_x = round(x);
	      float floor_y = round(y);

        
          z = sin(vData[int(floor_x)] / 50.0 + vData[int(floor_y)] / 50.0) * 2.0;


       gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, z, 1.0);
}