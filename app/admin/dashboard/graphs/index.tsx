import React from "react";
import PopulationGraph from "./population";
import { useQuery } from "@tanstack/react-query";
import { getDashboardGraph } from "@/services/api";
import { AgeGraph } from "./age";

const Graphs = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["graph"],
    queryFn: () => getDashboardGraph({}),
  });

  const populationData = data?.population || [];
  const ageData = data?.age || [];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:grid-rows-5">
      <div className="lg:col-span-2 lg:row-span-5">
        <PopulationGraph data={populationData} />
      </div>

      <div className="lg:col-span-2 lg:row-span-5">
        <AgeGraph data={ageData} />
      </div>
    </div>
  );
};

export default Graphs;
