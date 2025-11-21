import type { Target } from "../contexts/targetsContext";
import type { DatabaseColName, SuiviColName } from "../types/globales";
import { calcColumnTotal } from "./calcColumnTotal";

export const calcDonutGroups = ({
  selectedSuiviDay,
  database,
  targets,
}: {
  selectedSuiviDay:
    | Record<SuiviColName, string | number | undefined>
    | undefined;
  database: Record<DatabaseColName, string | number | undefined>[];
  targets: Target[];
}) => {
  const calcColumnTotalDay = calcColumnTotal({
    periods: [
      selectedSuiviDay?.matin?.toString() ?? "",
      selectedSuiviDay?.midi?.toString() ?? "",
      selectedSuiviDay?.goûter?.toString() ?? "",
      selectedSuiviDay?.soir?.toString() ?? "",
    ],
    database: database,
  });

  const targetCalories = parseFloat(
    targets.find((target) => target.targetName === "Calories")?.min ?? "0"
  );

  const targetProteines = parseFloat(
    targets.find((target) => target.targetName === "Proteines")?.min ?? "0"
  );

  const targetGlucides = parseFloat(
    targets.find((target) => target.targetName === "Glucides")?.min ?? "0"
  );

  const targetLipides = parseFloat(
    targets.find((target) => target.targetName === "Lipides")?.min ?? "0"
  );

  const targetFibresSolubles = parseFloat(
    targets.find((target) => target.targetName === "fibre solubles")?.min ?? "0"
  );

  const targetFibresInsolubles = parseFloat(
    targets.find((target) => target.targetName === "fibres insolubles")?.min ??
      "0"
  );

  const targetFibresTotal = parseFloat(
    targets.find((target) => target.targetName === "fibre total")?.min ?? "0"
  );

  const targetFibresSolubleInsolubleRatio = parseFloat(
    targets.find((target) => target.targetName === "soluble / insoluble")
      ?.min ?? "0"
  );

  const targetSodium = parseFloat(
    targets.find((target) => target.targetName === "Sodium")?.max ?? "0"
  );

  const targetPotassium = parseFloat(
    targets.find((target) => target.targetName === "Potassium")?.min ?? "0"
  );

  const targetCalcium = parseFloat(
    targets.find((target) => target.targetName === "Calcium")?.min ?? "0"
  );

  const targetMagnesium = parseFloat(
    targets.find((target) => target.targetName === "Magnésium")?.min ?? "0"
  );

  const targetFer = parseFloat(
    targets.find((target) => target.targetName === "Fer")?.min ?? "0"
  );

  const targetZinc = parseFloat(
    targets.find((target) => target.targetName === "Zinc")?.min ?? "0"
  );

  const targetVitamineD = parseFloat(
    targets.find((target) => target.targetName === "Vitamine D")?.min ?? "0"
  );

  const targetVitamineB9 = parseFloat(
    targets.find((target) => target.targetName === "Vitamine B9")?.min ?? "0"
  );

  const targetVitamineB12 = parseFloat(
    targets.find((target) => target.targetName === "Vitamine B12")?.min ?? "0"
  );

  const targetVitamineC = parseFloat(
    targets.find((target) => target.targetName === "Vitamine C")?.min ?? "0"
  );

  const targetOmega3 = parseFloat(
    targets.find((target) => target.targetName === "Oméga-3")?.min ?? "0"
  );

  const targetOmega6 = parseFloat(
    targets.find((target) => target.targetName === "Oméga-6")?.min ?? "0"
  );

  const targetOmega3Omega6Ratio = parseFloat(
    targets.find((target) => target.targetName === "Ω3 / Ω6")?.min ?? "0"
  );

  type donutGroupItem = {
    name: DatabaseColName;
    colorValue: string;
    colorTarget: string;
    value: number;
    target: number;
    textLines: string[];
    unit: string;
  };

  const donutGroups: donutGroupItem[][] = [
    [
      {
        name: "Calories",
        colorValue: "rgba(44, 44, 44, 0.2)",
        colorTarget: "rgba(172, 172, 172, 0.2)",
        value: calcColumnTotalDay("Calories"),
        target: targetCalories,
        textLines: [
          "Calories",
          `${calcColumnTotalDay("Calories").toFixed(
            0
          )} / ${targetCalories} kcal`,
        ],
        unit: "kcal",
      },
      {
        name: "Proteines",
        colorValue: "rgba(70, 92, 255, 0.2)",
        colorTarget: "rgba(167, 178, 255, 0.2)",
        value: calcColumnTotalDay("Proteines"),
        target: targetProteines,
        textLines: [
          "Proteines",
          `${calcColumnTotalDay("Proteines").toFixed(
            1
          )} / ${targetProteines} g`,
        ],
        unit: "g",
      },
      {
        name: "Lipides",
        colorValue: "rgba(255, 217, 45, 0.35)",
        colorTarget: "rgba(255, 233, 161, 0.2)",
        value: calcColumnTotalDay("Lipides"),
        target: targetLipides,
        textLines: [
          "Lipides",
          `${calcColumnTotalDay("Lipides").toFixed(1)} / ${targetLipides} g`,
        ],
        unit: "g",
      },
      {
        name: "Glucides",
        colorValue: "rgba(235, 54, 54, 0.2)",
        colorTarget: "rgba(255, 192, 192, 0.2)",
        value: calcColumnTotalDay("Glucides"),
        target: targetGlucides,
        textLines: [
          "Glucides",
          `${calcColumnTotalDay("Glucides").toFixed(1)} / ${targetGlucides} g`,
        ],
        unit: "g",
      },
    ],
    [
      {
        name: "fibre solubles",
        colorValue: "rgba(34, 139, 34, 0.2)",
        colorTarget: "rgba(144, 238, 144, 0.2)",
        value: calcColumnTotalDay("fibre solubles"),
        target: targetFibresSolubles,
        textLines: [
          "Fibres solubles",
          `${calcColumnTotalDay("fibre solubles").toFixed(
            1
          )} / ${targetFibresSolubles.toFixed(1)} g`,
        ],
        unit: "g",
      },
      {
        name: "fibres insolubles",
        colorValue: "rgba(100, 43, 0, 0.33)",
        colorTarget: "rgba(219, 82, 33, 0.33)",
        value: calcColumnTotalDay("fibres insolubles"),
        target: targetFibresInsolubles,
        textLines: [
          "Fibres insolubles",
          `${calcColumnTotalDay("fibres insolubles").toFixed(
            1
          )} / ${targetFibresInsolubles.toFixed(1)} g`,
        ],
        unit: "g",
      },
      {
        name: "fibre total",
        colorValue: "rgba(135, 139, 34, 0.2)",
        colorTarget: "rgba(238, 233, 144, 0.2)",
        value: calcColumnTotalDay("fibre total"),
        target: targetFibresTotal,
        textLines: [
          "Fibres totales",
          `${calcColumnTotalDay("fibre total").toFixed(
            1
          )} / ${targetFibresTotal.toFixed(0)} g`,
        ],
        unit: "g",
      },
      {
        name: "soluble / insoluble",
        colorValue: "rgba(60, 179, 113, 0.2)",
        colorTarget: "rgba(152, 251, 152, 0.2)",
        value:
          calcColumnTotalDay("fibre solubles") /
          (calcColumnTotalDay("fibres insolubles") || 1),
        target: targetFibresSolubleInsolubleRatio,
        textLines: [
          "Soluble / Insoluble",
          `${(
            calcColumnTotalDay("fibre solubles") /
            (calcColumnTotalDay("fibres insolubles") || 1)
          ).toFixed(2)} / ${targetFibresSolubleInsolubleRatio}`,
        ],
        unit: "",
      },
    ],
    [
      {
        name: "Sodium",
        colorValue: "rgba(255, 69, 0, 0.2)",
        colorTarget: "rgba(255, 160, 122, 0.2)",
        value: calcColumnTotalDay("Sodium"),
        target: targetSodium,
        textLines: [
          "Sodium",
          `${calcColumnTotalDay("Sodium").toFixed(0)} / ${targetSodium} mg`,
        ],
        unit: "mg",
      },
      {
        name: "Potassium",
        colorValue: "rgba(30, 144, 255, 0.2)",
        colorTarget: "rgba(135, 206, 250, 0.2)",
        value: calcColumnTotalDay("Potassium"),
        target: targetPotassium,
        textLines: [
          "Potassium",
          `${calcColumnTotalDay("Potassium").toFixed(
            0
          )} / ${targetPotassium} mg`,
        ],
        unit: "mg",
      },
      {
        name: "Calcium",
        colorValue: "rgba(100, 149, 237, 0.2)",
        colorTarget: "rgba(173, 216, 230, 0.2)",
        value: calcColumnTotalDay("Calcium"),
        target: targetCalcium,
        textLines: [
          "Calcium",
          `${calcColumnTotalDay("Calcium").toFixed(0)} / ${targetCalcium} mg`,
        ],
        unit: "mg",
      },
    ],
    [
      {
        name: "Magnésium",
        colorValue: "rgba(72, 61, 139, 0.2)",
        colorTarget: "rgba(216, 191, 216, 0.2)",
        value: calcColumnTotalDay("Magnésium"),
        target: targetMagnesium,
        textLines: [
          "Magnésium",
          `${calcColumnTotalDay("Magnésium").toFixed(
            0
          )} / ${targetMagnesium} mg`,
        ],
        unit: "mg",
      },
      {
        name: "Fer",
        colorValue: "rgba(178, 34, 34, 0.2)",
        colorTarget: "rgba(255, 182, 193, 0.2)",
        value: calcColumnTotalDay("Fer"),
        target: targetFer,
        textLines: [
          "Fer",
          `${calcColumnTotalDay("Fer").toFixed(1)} / ${targetFer} mg`,
        ],
        unit: "mg",
      },
      {
        name: "Zinc",
        colorValue: "rgba(205, 133, 63, 0.2)",
        colorTarget: "rgba(244, 164, 96, 0.2)",
        value: calcColumnTotalDay("Zinc"),
        target: targetZinc,
        textLines: [
          "Zinc",
          `${calcColumnTotalDay("Zinc").toFixed(1)} / ${targetZinc} mg`,
        ],
        unit: "mg",
      },
    ],
    [
      {
        name: "Vitamine D",
        colorValue: "rgba(218, 165, 32, 0.2)",
        colorTarget: "rgba(255, 215, 0, 0.2)",
        value: calcColumnTotalDay("Vitamine D"),
        target: targetVitamineD,
        textLines: [
          "Vitamine D",
          `${calcColumnTotalDay("Vitamine D").toFixed(
            1
          )} / ${targetVitamineD} µg`,
        ],
        unit: "µg",
      },
      {
        name: "Vitamine B9",
        colorValue: "rgba(123, 104, 238, 0.2)",
        colorTarget: "rgba(216, 191, 216, 0.2)",
        value: calcColumnTotalDay("Vitamine B9"),
        target: targetVitamineB9,
        textLines: [
          "Vitamine B9",
          `${calcColumnTotalDay("Vitamine B9").toFixed(
            1
          )} / ${targetVitamineB9} µg`,
        ],
        unit: "µg",
      },
      {
        name: "Vitamine B12",
        colorValue: "rgba(199, 21, 133, 0.2)",
        colorTarget: "rgba(255, 182, 193, 0.2)",
        value: calcColumnTotalDay("Vitamine B12"),
        target: targetVitamineB12,
        textLines: [
          "Vitamine B12",
          `${calcColumnTotalDay("Vitamine B12").toFixed(
            1
          )} / ${targetVitamineB12} µg`,
        ],
        unit: "µg",
      },
      {
        name: "Vitamine C",
        colorValue: "rgba(50, 205, 50, 0.2)",
        colorTarget: "rgba(144, 238, 144, 0.2)",
        value: calcColumnTotalDay("Vitamine C"),
        target: targetVitamineC,
        textLines: [
          "Vitamine C",
          `${calcColumnTotalDay("Vitamine C").toFixed(
            1
          )} / ${targetVitamineC} mg`,
        ],
        unit: "mg",
      },
    ],
    [
      {
        name: "Oméga-3",
        colorValue: "rgba(0, 191, 255, 0.2)",
        colorTarget: "rgba(135, 206, 250, 0.2)",
        value: calcColumnTotalDay("Oméga-3"),
        target: targetOmega3,
        textLines: [
          "Oméga-3",
          `${calcColumnTotalDay("Oméga-3").toFixed(1)} / ${targetOmega3} mg`,
        ],
        unit: "mg",
      },
      {
        name: "Oméga-6",
        colorValue: "rgba(255, 140, 0, 0.2)",
        colorTarget: "rgba(255, 218, 185, 0.2)",
        value: calcColumnTotalDay("Oméga-6"),
        target: targetOmega6,
        textLines: [
          "Oméga-6",
          `${calcColumnTotalDay("Oméga-6").toFixed(1)} / ${targetOmega6} mg`,
        ],
        unit: "mg",
      },
      {
        name: "Ω3 / Ω6",
        colorValue: "rgba(72, 209, 204, 0.2)",
        colorTarget: "rgba(175, 238, 238, 0.2)",
        value:
          calcColumnTotalDay("Oméga-3") / (calcColumnTotalDay("Oméga-6") || 1),
        target: targetOmega3Omega6Ratio,
        textLines: [
          "Ω3 / Ω6",
          `${(
            calcColumnTotalDay("Oméga-3") / (calcColumnTotalDay("Oméga-6") || 1)
          ).toFixed(2)} / ${targetOmega3Omega6Ratio}`,
        ],
        unit: "",
      },
    ],
  ];

  return donutGroups;
};
