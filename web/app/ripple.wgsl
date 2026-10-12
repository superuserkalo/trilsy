// A slowly turning, folded glass loop. Original Trilsy artwork.
struct Params { time: f32, aspect: f32, pointer: vec2f }
@group(0) @binding(0) var<uniform> params: Params;
const PI: f32 = 3.14159265359;
fn rot(p: vec2f, a: f32) -> vec2f { return vec2f(cos(a)*p.x-sin(a)*p.y, sin(a)*p.x+cos(a)*p.y); }
fn shape(point: vec3f) -> f32 {
  let phase = params.time * 2.0 * PI / 10.0;
  var p = point;
  let xy = rot(p.xy, 0.32 + 0.18*sin(phase) + (params.pointer.x-0.5)*0.4);
  p = vec3f(xy, p.z);
  let yz = rot(p.yz, 0.6 + 0.3*cos(phase) + (params.pointer.y-0.5)*0.25);
  p = vec3f(p.x, yz);
  let a = atan2(p.y,p.x);
  let ring = 1.0 + 0.075*cos(a*3.0 + phase);
  var cross = vec2f(length(p.xy)-ring, p.z);
  cross = rot(cross, a*1.5 + phase*0.5);
  // A flattened, twisted band, with fine fluted highlights.
  let flutes = 0.009*cos(a*90.0);
  return (length(vec2f(cross.x/0.38, cross.y/0.17))-1.0)*0.15 + flutes;
}
fn normal(p: vec3f) -> vec3f {
 let e=0.002;
 return normalize(vec3f(shape(p+vec3f(e,0,0))-shape(p-vec3f(e,0,0)),shape(p+vec3f(0,e,0))-shape(p-vec3f(0,e,0)),shape(p+vec3f(0,0,e))-shape(p-vec3f(0,0,e))));
}
fn environment(r: vec3f) -> vec3f {
 var col=mix(vec3f(0.065,0.19,0.6),vec3f(0.92,0.98,1.0),smoothstep(-0.7,0.8,r.y));
 col += vec3f(1.1,1.15,1.2)*pow(max(dot(r,normalize(vec3f(-0.6,0.8,0.7))),0.0),24.0);
 col += vec3f(0.7,0.84,1.0)*pow(max(dot(r,normalize(vec3f(0.7,0.2,0.3))),0.0),64.0);
 col=mix(col,vec3f(0.055,0.12,0.35),smoothstep(0.91,0.99,sin(r.x*7.0+r.y*2.0))*0.45);
 return col;
}
@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
 let screen=vec2f((uv.x-0.5)*params.aspect,0.5-uv.y);
 let background=vec3f(0.855,0.914,0.992);
 var color=background;
 let shadow=exp(-pow(screen.x*2.4,2.0)-pow((screen.y+0.63)*13.0,2.0));
 color=mix(color,vec3f(0.34,0.49,0.8),shadow*0.22);
 let ro=vec3f(0.0,0.0,4.2);
 let rd=normalize(vec3f(screen*3.6,-4.2));
 var travel=0.0;
 var hit=false;
 for(var i=0;i<78;i++) {
   let d=shape(ro+rd*travel);
   if(d<0.0014){hit=true;break;}
   travel+=d*0.82;
   if(travel>7.0){break;}
 }
 if(hit){
   let p=ro+rd*travel;
   let n=normal(p);
   let facing=max(dot(n,-rd),0.0);
   let fresnel=pow(1.0-facing,2.1);
   let reflection=environment(reflect(rd,n));
   let body=vec3f(0.48,0.69,1.0)*(0.68+0.32*max(dot(n,normalize(vec3f(-0.5,0.8,1.0))),0.0));
   color=mix(body,reflection,0.44+fresnel*0.46);
   color=mix(background,color,0.72+fresnel*0.28);
   color+=vec3f(0.2,0.3,0.5)*pow(facing,24.0);
 }
 return vec4f(color,1.0);
}
