import React, { useEffect, useState } from 'react';

export function BrowserRender(props: { onRender: () => JSX.Element }) {
  const [isRender, setIsRender] = useState<boolean>(false);

  useEffect(() => {
    setIsRender(true);
  }, []);

  return <>{isRender && props.onRender()}</>;
}
