import { Box3, Group, Mesh, Vector3 } from 'three';

type SurfaceHeight = (x: number, z: number) => number;

// La circunferencia se apoya en el relieve: también detecta la rampa delante del eje.
export function wheelSupportHeight(x: number, z: number, radius: number, yaw: number, heightAt: SurfaceHeight) {
  let centerY = heightAt(x, z) + radius;
  for (let i = -24; i <= 24; i++) {
    const offset = radius * i / 24;
    const height = heightAt(x + Math.sin(yaw) * offset, z + Math.cos(yaw) * offset);
    centerY = Math.max(centerY, height + Math.sqrt(Math.max(0, radius * radius - offset * offset)));
  }
  return centerY;
}

export function createWheelContact(object: Group, body: Group, groundY: number) {
  object.updateMatrixWorld(true);
  const meshes: Mesh[] = [];
  object.traverse((child) => {
    if (child instanceof Mesh && child.name.includes('_wheel_')) meshes.push(child);
  });
  const wheels = meshes.map((mesh) => {
    const bounds = new Box3().setFromObject(mesh, true);
    const center = bounds.getCenter(new Vector3());
    const radius = bounds.getSize(new Vector3()).y / 2;
    const pivot = new Group();
    pivot.name = `apoyo-${mesh.name}`;
    pivot.position.copy(object.worldToLocal(center));
    object.add(pivot);
    pivot.updateMatrixWorld(true);
    pivot.attach(mesh);
    return { pivot, rest: pivot.position.clone(), radius, lift: 0 };
  });
  const point = new Vector3();
  let spin = 0;

  function reset() {
    spin = 0;
    body.position.y = 0;
    body.rotation.set(0, 0, 0);
    for (const wheel of wheels) {
      wheel.pivot.position.copy(wheel.rest);
      wheel.pivot.rotation.set(0, 0, 0);
      wheel.lift = 0;
    }
  }

  function update(delta: number, speed: number, heightAt: SurfaceHeight) {
    object.position.y = 0;
    object.updateMatrixWorld(true);
    spin += speed * delta;
    for (const wheel of wheels) {
      point.copy(wheel.rest);
      object.localToWorld(point);
      const y = wheelSupportHeight(point.x, point.z, wheel.radius, object.rotation.y, heightAt);
      wheel.lift = y - (groundY + wheel.radius);
      wheel.pivot.position.y = wheel.rest.y + wheel.lift;
      wheel.pivot.rotation.x = spin / wheel.radius;
    }
    if (wheels.length !== 4) return;
    const front = wheels.filter((wheel) => wheel.rest.z > 0);
    const rear = wheels.filter((wheel) => wheel.rest.z < 0);
    const left = wheels.filter((wheel) => wheel.rest.x < 0);
    const right = wheels.filter((wheel) => wheel.rest.x > 0);
    const average = (items: typeof wheels, field: 'lift' | 'x' | 'z') =>
      items.reduce((sum, wheel) => sum + (field === 'lift' ? wheel.lift : wheel.rest[field]), 0) / Math.max(items.length, 1);
    const wheelbase = average(front, 'z') - average(rear, 'z');
    const track = average(right, 'x') - average(left, 'x');
    body.position.y = average(wheels, 'lift');
    // Las ruedas conservan el apoyo individual mientras la carrocería cabecea y se inclina.
    body.rotation.x = -Math.atan2(average(front, 'lift') - average(rear, 'lift'), wheelbase);
    body.rotation.z = Math.atan2(average(right, 'lift') - average(left, 'lift'), track);
  }

  return { update, reset };
}
