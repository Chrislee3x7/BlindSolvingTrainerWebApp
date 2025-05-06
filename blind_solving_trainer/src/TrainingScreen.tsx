import { useCallback, useEffect, useState } from "react";
import { MemoSchemeType } from "./MemoScheme";
import { Button } from "./components/ui/button";
import { ChevronLeft } from "lucide-react";
import { CornerPieceView, PieceViews } from "./PieceViews";
import { EdgePieceView } from "./EdgePieceView";

interface TrainingScreenProps {
  memoScheme: MemoSchemeType;
  backToMemoSetup: () => void;
};

const TrainingScreen: React.FC<TrainingScreenProps> = ({ memoScheme, backToMemoSetup }) => {


  return (
    <div className="flex flex-col h-full w-full p-4 gap-2">
      <div className="flex">
        <Button className="flex" onClick={backToMemoSetup}>
          <ChevronLeft />
          <h2>back</h2>
        </Button>
      </div>
      <div className="dynamic-vertical-layout grow items-center">
        <div className="grow content-center justify-center items-center bg-red-500" style={{ height: "66%" }}>
          {/* <CornerPieceView colors={['red', 'blue', 'white']} /> */}
          {/* {PieceViews.getRandomCornerPieceView(['red', 'white', 'blue'])} */}
          {/* {PieceViews.getRandomEdgePieceView(['red', 'white'])} */}
          {/* {PieceViews.getRandomEdgePieceView(['red', 'white'])} */}
          {PieceViews.getRandomEdgePieceView(['red', 'white'])}
        </div>
        <div className="flex-3 w-full h-full justify-center items-center content-center bg-indigo-400">
          hello
        </div>
      </div>
    </div>
  );
}

export default TrainingScreen;