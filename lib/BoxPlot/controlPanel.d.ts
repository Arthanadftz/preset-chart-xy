declare const _default: {
    controlPanelSections: {
        label: string;
        expanded: boolean;
        controlSetRows: (string[] | ({
            name: string;
            config: {
                type: string;
                freeForm: boolean;
                label: string;
                default: string;
                description: string;
                choices: ["Tukey" | "Min/max (no outliers)" | "2/98 percentiles" | "9/91 percentiles", string][];
                clearable?: undefined;
                renderTrigger?: undefined;
            };
        } | {
            name: string;
            config: {
                type: string;
                label: string;
                choices: ["flat" | "auto" | "45°" | "staggered", string][];
                default: string;
                clearable: boolean;
                renderTrigger: boolean;
                description: string;
                freeForm?: undefined;
            };
        })[])[];
    }[];
};
export default _default;
//# sourceMappingURL=controlPanel.d.ts.map