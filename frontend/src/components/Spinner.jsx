import React from "react";
import { InfinitySpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <InfinitySpin
        visible={true}
        width="200"
        color="#3b82f6"
        ariaLabel="infinity-spin-loading"
      />
    </div>
  );
};

export default Loader;
