/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameCanvas } from './components/GameCanvas';

export default function App() {
  return (
    <main className="w-screen h-screen bg-[#060608] text-[#e8dfd3] flex items-center justify-center overflow-hidden">
      <GameCanvas />
    </main>
  );
}
