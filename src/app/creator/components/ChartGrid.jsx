import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";

const data = [
  { name: "Event 1", value: 400 },
  { name: "Event 2", value: 300 },
  { name: "Event 3", value: 200 },
  { name: "Event 4", value: 278 },
  { name: "Event 5", value: 189 },
];

const locationData = [
  { name: "Swaziland", value: 2400 },
  { name: "Nihon", value: 4567 },
  { name: "Others", value: 1398 },
];

const devicesData = [
  { name: "Meta Quest", value: 2400 },
  { name: "Apple VR", value: 4567 },
  { name: "Laptop", value: 1398 },
  { name: "Mobile Phone", value: 9800 },
];

const genderData = [
  { name: "Male", value: 400 },
  { name: "Female", value: 300 },
  { name: "Others", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const chartTitles = [
  "Event vs Attendees",
  "Event vs Revenue",
  "Event vs Impression",
  "Time vs Event",
  "Age of Attendees",
  "Location of Attendees",
  "Devices Used",
  "Gender Ratio",
];

const renderCustomizedLabel = (props) => {
  const { x, y, width, height, value } = props;
  const radius = 10;

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {value}
    </text>
  );
};

const ChartGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {chartTitles.map((title, index) => (
        <div
          key={index}
          className="flex flex-col rounded-xl border bg-blue-700 text-white px-4 py-4 sm:px-6 sm:py-6 shadow-md"
        >
          <h2 className="font-semibold text-md sm:text-lg text-center mb-4">
            {title}
          </h2>
          <div className="h-48 sm:h-60">
            <ResponsiveContainer width="100%" height="100%">
              {title === "Gender Ratio" ? (
                <PieChart>
                  <Pie
                    data={genderData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    fill="#8884d8"
                    label
                  >
                    {genderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : title === "Location of Attendees" ||
                title === "Devices Used" ? (
                <BarChart
                  data={
                    title === "Location of Attendees"
                      ? locationData
                      : devicesData
                  }
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis type="number" stroke="#fff" />
                  <YAxis type="category" dataKey="name" stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#333",
                      borderColor: "#333",
                      color: "white",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "white" }} />
                  <Bar dataKey="value" fill="#82ca9d">
                    <LabelList dataKey="value" fill="#fff" />
                  </Bar>
                </BarChart>
              ) : (
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#333",
                      borderColor: "#333",
                      color: "white",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "white" }} />
                  <Bar dataKey="value" fill="#82ca9d">
                    <LabelList dataKey="value" fill="#fff" />
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartGrid;
