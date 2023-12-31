import { useContext, useLayoutEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CryptoContext } from "../context/CryptoContext";

function CustomTooltip({ payload, label, active, currency }) {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 5,
        }).format(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
}

const ChartComponent = ({ data, currency, type }) => {
  return (
    <ResponsiveContainer height={"90%"}>
      <LineChart width={400} height={400} data={data}>
        <Line
          type="monotone"
          dataKey={type}
          stroke="#14ffec"
          strokeWidth={"1px"}
        />
        <CartesianGrid stroke="#323232" />
        <XAxis dataKey="date" hide />
        <YAxis dataKey={type} hide domain={["auto", "auto"]} />
        <Tooltip
          content={<CustomTooltip />}
          currency={currency}
          cursor={false}
          wrapperStyle={{ outline: "none" }}
        />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};

const Chart = ({ id }) => {
  const [chartData, setChartData] = useState();
  let { currency } = useContext(CryptoContext);
  const [type, setType] = useState("prices");
  const [days, setDays] = useState("7");
  useLayoutEffect(() => {
    const getChartData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}&interval=daily`
        );
        const data = await response.json();

        // console.log(data);
        let dataChange = data[type].map((item) => {
          return {
            date: new Date(item[0]).toLocaleDateString(),
            [type]: item[1],
          };
        });
        // console.log(dataChange);
        setChartData(dataChange);
      } catch (error) {
        // console.error("Error fetching data:", error);
        // Handle the error here
      }
    };
    getChartData(id);
  }, [id, type, days]);

  return (
    <div className="w-full h-[60%] mt-[2.5rem]">
      <ChartComponent data={chartData} currency={currency} type={type} />
      <div className="flex items-center justify-around">
        <div className="flex ">
          <button
            className={`mx-2 bg-opacity-30 px-1 text-sm py-0.5 rounded ${
              type === "prices"
                ? "bg-cyan text-cyan"
                : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => {
              setType("prices");
            }}
          >
            Price
          </button>
          <button
            className={`mx-2 bg-opacity-30 px-1 text-sm py-0.5 rounded ${
              type === "market_caps"
                ? "bg-cyan text-cyan"
                : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => {
              setType("market_caps");
            }}
          >
            Market Cap
          </button>
          <button
            className={`mx-2 bg-opacity-30 px-1 text-sm py-0.5 rounded ${
              type === "total_volumes"
                ? "bg-cyan text-cyan"
                : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => {
              setType("total_volumes");
            }}
          >
            Total Volume
          </button>
        </div>
        <div className="flex">
          <button
            className={`mx-2 bg-opacity-30 px-1 text-sm py-0.5 rounded ${
              days === "7" ? "bg-cyan text-cyan" : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => {
              setDays("7");
            }}
          >
            7d
          </button>
          <button
            className={`mx-2 bg-opacity-30 px-1 text-sm py-0.5 rounded ${
              days === "14" ? "bg-cyan text-cyan" : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => {
              setDays("14");
            }}
          >
            14d
          </button>
          <button
            className={`mx-2 bg-opacity-30 px-1 text-sm py-0.5 rounded ${
              days === "30" ? "bg-cyan text-cyan" : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => {
              setDays("30");
            }}
          >
            30d
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chart;
