import React, { lazy, Suspense } from 'react';

const LazySalonDetails = lazy(() => import('./SalonDetails'));

const SalonDetails = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazySalonDetails {...props} />
  </Suspense>
);

export default SalonDetails;
