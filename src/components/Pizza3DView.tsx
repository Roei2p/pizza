import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { AppliedTopping, QuarterId } from '../types';

interface Pizza3DViewProps {
  appliedToppings: AppliedTopping[];
  sizeScale: number;
}

// Visual recipe per topping id: color + primitive shape used to represent it
// in 3D. This is a stylized proof-of-concept, not a photoreal render.
const TOPPING_VISUALS: Record<string, { color: string; shape: 'sphere' | 'disc' | 'ring'; size: number }> = {
  olives_green: { color: '#7a8b3f', shape: 'ring', size: 0.11 },
  olives_kalamata: { color: '#2b2320', shape: 'ring', size: 0.11 },
  mushrooms: { color: '#e8ddc7', shape: 'disc', size: 0.14 },
  corn: { color: '#f5c53d', shape: 'sphere', size: 0.06 },
  onion_red: { color: '#9c4f8f', shape: 'ring', size: 0.13 },
  tomatoes: { color: '#c0392b', shape: 'sphere', size: 0.13 },
  jalapeno: { color: '#4f8a3d', shape: 'ring', size: 0.12 },
  extra_cheese: { color: '#f7e196', shape: 'disc', size: 0.15 },
  feta: { color: '#f5f2e6', shape: 'disc', size: 0.12 },
  tuna: { color: '#c9a58f', shape: 'sphere', size: 0.13 },
  pineapple: { color: '#f0c419', shape: 'disc', size: 0.14 },
  garlic_confit: { color: '#f3e9d2', shape: 'sphere', size: 0.1 },
  fresh_basil: { color: '#3f7a3a', shape: 'disc', size: 0.13 },
};

const QUARTER_ANGLES: Record<QuarterId, [number, number]> = {
  1: [0, Math.PI / 2],
  2: [Math.PI / 2, Math.PI],
  3: [Math.PI, (3 * Math.PI) / 2],
  4: [(3 * Math.PI) / 2, 2 * Math.PI],
};

// Deterministic pseudo-random in [0,1) seeded by a string, so topping
// scatter positions stay stable across re-renders instead of jumping.
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return (Math.abs(h) % 1000) / 1000;
}

const CHEESE_RADIUS = 2.3;

function ToppingInstances({ toppingId, quarters }: { toppingId: string; quarters: QuarterId[] }) {
  const visual = TOPPING_VISUALS[toppingId];
  if (!visual) return null;

  const pieces = useMemo(() => {
    const result: { x: number; z: number; rot: number }[] = [];
    quarters.forEach((q) => {
      const [start, end] = QUARTER_ANGLES[q];
      const perQuarterCount = 4;
      for (let i = 0; i < perQuarterCount; i++) {
        const seed = `${toppingId}-${q}-${i}`;
        const angle = start + seededRandom(seed) * (end - start);
        const radius = 0.4 + seededRandom(seed + 'r') * (CHEESE_RADIUS - 0.9);
        result.push({
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          rot: seededRandom(seed + 'rot') * Math.PI,
        });
      }
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toppingId, quarters.join(',')]);

  return (
    <>
      {pieces.map((p, idx) => {
        const y = 0.2;
        if (visual.shape === 'sphere') {
          return (
            <mesh key={idx} position={[p.x, y, p.z]} castShadow>
              <sphereGeometry args={[visual.size, 12, 12]} />
              <meshStandardMaterial color={visual.color} roughness={0.6} />
            </mesh>
          );
        }
        if (visual.shape === 'ring') {
          return (
            <mesh key={idx} position={[p.x, y, p.z]} rotation={[Math.PI / 2, 0, p.rot]} castShadow>
              <torusGeometry args={[visual.size * 0.6, visual.size * 0.35, 8, 16]} />
              <meshStandardMaterial color={visual.color} roughness={0.5} />
            </mesh>
          );
        }
        return (
          <mesh key={idx} position={[p.x, y, p.z]} rotation={[Math.PI / 2, 0, p.rot]} castShadow>
            <cylinderGeometry args={[visual.size, visual.size, 0.05, 16]} />
            <meshStandardMaterial color={visual.color} roughness={0.7} />
          </mesh>
        );
      })}
    </>
  );
}

function PizzaModel({ appliedToppings, sizeScale }: Pizza3DViewProps) {
  return (
    <group scale={sizeScale}>
      {/* Crust */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.6, 2.7, 0.3, 48]} />
        <meshStandardMaterial color="#dba85f" roughness={0.85} />
      </mesh>
      {/* Sauce peeking at the edge */}
      <mesh position={[0, 0.16, 0]} receiveShadow>
        <cylinderGeometry args={[2.42, 2.42, 0.06, 48]} />
        <meshStandardMaterial color="#b23a2e" roughness={0.7} />
      </mesh>
      {/* Cheese layer */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.32, 2.32, 0.08, 48]} />
        <meshStandardMaterial color="#f2d581" roughness={0.55} />
      </mesh>

      {appliedToppings.map((at) => (
        <ToppingInstances key={at.toppingId} toppingId={at.toppingId} quarters={at.quarters} />
      ))}
    </group>
  );
}

export const Pizza3DView: React.FC<Pizza3DViewProps> = ({ appliedToppings, sizeScale }) => {
  return (
    <div className="w-full h-72 sm:h-80 rounded-xl overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 5.2, 4.6], fov: 40 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 6, 4]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} />
        <PizzaModel appliedToppings={appliedToppings} sizeScale={sizeScale} />
        <ContactShadows position={[0, -0.16, 0]} opacity={0.4} scale={10} blur={2.2} far={2} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={9}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 2.3}
          autoRotate
          autoRotateSpeed={2.2}
        />
      </Canvas>
    </div>
  );
};
