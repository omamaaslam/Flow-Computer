// Defines all the props this SVG component will accept
interface IoCardSvgProps {
  onModClick: () => void;
  modStatusColor: string;
  onDi2Click: () => void;
  di2StatusColor: string;
  onDi4LeftClick: () => void;
  di4LeftStatusColor: string;
  onAi1Click: () => void;
  ai1StatusColor: string;
  onDo2Click: () => void;
  do2StatusColor: string;
  onDi4_2Click: () => void;
  di4_2StatusColor: string;
  onAi2Click: () => void;
  ai2StatusColor: string;
  onHart2Click: () => void;
  hart2StatusColor: string;
  onAo1Click: () => void;
  ao1StatusColor: string;
  onDi1Click: () => void;
  di1StatusColor: string;
  onDi3Click: () => void;
  di3StatusColor: string;
  onDi5Click: () => void;
  di5StatusColor: string;
  onDo5TopClick: () => void;
  do5TopStatusColor: string;
  onDo3Click: () => void;
  do3StatusColor: string;
  onDo5BottomClick: () => void;
  do5BottomStatusColor: string;
  onHart1Click: () => void;
  hart1StatusColor: string;
  onRtdClick: () => void;
  rtdStatusColor: string;
  onAo2Click: () => void;
  ao2StatusColor: string;
}

const IoCardSvg = (props: IoCardSvgProps) => {
  // A helper to determine text color for better contrast
  const getTextColor = (color: string) => {
    // If the color is red or a dark color, use white text. Otherwise, use black.
    return color === "#FF3D00" ? "white" : "black";
  };

  return (
    <svg
      className="w-full h-[350px] md:h-[650px]" // Small screen height is 350px, medium and up is 650px
      viewBox="0 0 582 729"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Static Background Elements: Connector, Wires, Pins */}
      <g>
        <rect
          x="230.327"
          y="4.69772"
          width="122.75"
          height="658.265"
          rx="18.8847"
          fill="white"
          stroke="#211D1D"
          strokeWidth="5.39562"
          filter="url(#filter0_ddddd_274_395)"
        />
        {/* All static paths and circles for wires and pins go here... */}
        <path
          d="M317.079 120.412L316.099 118.617C314.208 115.15 310.575 112.993 306.626 112.993H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M275.263 136.599L271.216 129.18H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M317.079 56.6305L316.099 54.8353C314.208 51.3685 310.575 49.2115 306.626 49.2115H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M275.263 72.8175L271.216 65.3985H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M317.079 182.461L316.099 180.666C314.208 177.199 310.575 175.042 306.626 175.042H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M275.263 198.648L271.216 191.229H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M267.843 150.087L268.822 148.292C270.713 144.825 274.347 142.668 278.296 142.668H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M309.659 166.274L313.706 158.855H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M267.843 89.0043L268.822 87.2092C270.713 83.7424 274.347 81.5853 278.296 81.5853H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M309.659 105.191L313.706 97.772H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M267.843 213.103L268.822 211.308C270.713 207.841 274.347 205.684 278.296 205.684H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M309.659 229.29L313.706 221.871H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M267.843 275.153L268.822 273.358C270.713 269.891 274.347 267.734 278.296 267.734H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M309.659 291.34L313.706 283.921H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M267.843 337.203L268.822 335.407C270.713 331.941 274.347 329.784 278.296 329.784H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M309.659 353.389L313.706 345.97H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M267.843 399.252L268.822 397.457C270.713 393.99 274.347 391.833 278.296 391.833H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M309.659 415.439L313.706 408.02H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M267.843 461.301L268.822 459.506C270.713 456.039 274.347 453.882 278.296 453.882H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M309.659 477.488L313.706 470.069H496.482"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M267.845 616.425L268.824 614.63C270.715 611.163 274.349 609.006 278.298 609.006H496.484"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M309.661 632.612L313.708 625.193H496.484"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M267.845 523.351L268.824 521.556C270.715 518.089 274.349 515.932 278.298 515.932H496.484"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M309.661 539.538L313.708 532.119H496.484"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M309.661 570.563L313.708 563.144H496.484"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M267.844 553.701L272.782 546.957H495.809"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M317.079 244.128L316.099 242.333C314.208 238.866 310.575 236.709 306.626 236.709H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M275.263 260.315L271.216 252.896H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M317.079 306.178L316.099 304.383C314.208 300.916 310.575 298.759 306.626 298.759H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M275.263 322.365L271.216 314.946H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M317.079 368.227L316.099 366.432C314.208 362.966 310.575 360.808 306.626 360.808H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M275.263 384.414L271.216 376.995H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M317.079 430.277L316.099 428.482C314.208 425.015 310.575 422.858 306.626 422.858H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M275.263 446.464L271.216 439.045H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M317.079 493.676L316.099 491.88C314.208 488.414 310.575 486.257 306.626 486.257H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M275.263 508.896L271.216 501.477H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M317.079 585.401L316.099 583.606C314.208 580.139 310.575 577.982 306.626 577.982H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <path
          d="M275.263 601.588L271.216 594.169H88.4395"
          stroke="black"
          strokeWidth="4.04671"
        />
        <g>
          <circle cx="271.891" cy="64.0494" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="64.0494" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="95.0742" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="95.0742" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="126.099" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="126.099" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="157.124" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="157.124" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="188.149" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="188.149" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="219.173" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="219.173" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="250.198" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="250.198" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="281.223" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="281.223" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="312.248" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="312.248" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="343.272" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="343.272" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="374.297" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="374.297" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="405.322" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="405.322" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="436.347" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="436.347" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="467.372" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="467.372" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="498.396" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="498.396" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="529.421" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="529.421" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="560.446" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="560.446" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="591.471" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="591.471" r="10.7912" fill="#A2A1A1" />
          <circle cx="271.891" cy="622.496" r="10.7912" fill="#A2A1A1" />
          <circle cx="315.055" cy="622.496" r="10.7912" fill="#A2A1A1" />
        </g>
      </g>

      {/* Clickable & Dynamic Interface Groups */}
      <g
        onClick={props.onModClick}
        className="cursor-pointer group"
        filter="url(#filter2_dddd_274_395)"
      >
        <rect
          x="5"
          y="37.0715"
          width="158.387"
          height="39.1182"
          rx="5.39562"
          fill={props.modStatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="84.19"
          y="60.5"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.modStatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          MOD
        </text>
      </g>
      <g
        onClick={props.onDi2Click}
        className="cursor-pointer group"
        filter="url(#filter1_dddd_274_395)"
      >
        <rect
          x="5"
          y="101.819"
          width="158.387"
          height="39.1182"
          rx="5.39562"
          fill={props.di2StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="84.19"
          y="125"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.di2StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          DI2
        </text>
      </g>
      <g
        onClick={props.onDi4LeftClick}
        className="cursor-pointer group"
        filter="url(#filter3_dddd_274_395)"
      >
        <rect
          x="5"
          y="163.868"
          width="158.387"
          height="39.1182"
          rx="5.39562"
          fill={props.di4LeftStatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="84.19"
          y="186.43"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.di4LeftStatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          DI4
        </text>
      </g>
      <g
        onClick={props.onAi1Click}
        className="cursor-pointer group"
        filter="url(#filter13_dddd_274_395)"
      >
        <rect
          x="5"
          y="224.569"
          width="158.387"
          height="39.1182"
          rx="5.39562"
          fill={props.ai1StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="84.19"
          y="247.13"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.ai1StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          AI1
        </text>
      </g>
      <g
        onClick={props.onDo2Click}
        className="cursor-pointer group"
        filter="url(#filter14_dddd_274_395)"
      >
        <rect
          x="5"
          y="286.619"
          width="158.387"
          height="39.1182"
          rx="5.39562"
          fill={props.do2StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="84.19"
          y="309.18"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.do2StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          DO2
        </text>
      </g>
      <g
        onClick={props.onDi4_2Click}
        className="cursor-pointer group"
        filter="url(#filter15_dddd_274_395)"
      >
        <rect
          x="5"
          y="348.668"
          width="158.387"
          height="39.1182"
          rx="5.39562"
          fill={props.di4_2StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="84.19"
          y="371.23"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.di4_2StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          DI4
        </text>
      </g>
      <g
        onClick={props.onAi2Click}
        className="cursor-pointer group"
        filter="url(#filter16_dddd_274_395)"
      >
        <rect
          x="5"
          y="408.709"
          width="158.459"
          height="39.6149"
          rx="5.39562"
          fill={props.ai2StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="84.23"
          y="431.52"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.ai2StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          AI2
        </text>
      </g>
      <g
        onClick={props.onHart2Click}
        className="cursor-pointer group"
        filter="url(#filter17_dddd_274_395)"
      >
        <rect
          x="5"
          y="472.48"
          width="158.459"
          height="38.6486"
          rx="5.39562"
          fill={props.hart2StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="84.23"
          y="494.8"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.hart2StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          HART2
        </text>
      </g>
      <g
        onClick={props.onAo1Click}
        className="cursor-pointer group"
        filter="url(#filter18_dddd_274_395)"
      >
        <rect
          x="5"
          y="565.842"
          width="158.387"
          height="39.1182"
          rx="5.39562"
          fill={props.ao1StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="84.19"
          y="588.4"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.ao1StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          AO1
        </text>
      </g>
      <g
        onClick={props.onDi1Click}
        className="cursor-pointer group"
        filter="url(#filter5_dddd_274_395)"
      >
        <rect
          width="158.387"
          height="39.1182"
          rx="5.39562"
          transform="matrix(-1 0 0 1 575.764 69.4453)"
          fill={props.di1StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="496.57"
          y="92.00"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.di1StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          DI1
        </text>
      </g>
      <g
        onClick={props.onDi3Click}
        className="cursor-pointer group"
        filter="url(#filter4_dddd_274_395)"
      >
        <rect
          width="158.387"
          height="39.1182"
          rx="5.39562"
          transform="matrix(-1 0 0 1 575.764 131.495)"
          fill={props.di3StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="496.57"
          y="154.05"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.di3StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          DI3
        </text>
      </g>
      <g
        onClick={props.onDi5Click}
        className="cursor-pointer group"
        filter="url(#filter6_dddd_274_395)"
      >
        <rect
          x="416.607"
          y="193.311"
          width="159.426"
          height="39.6149"
          rx="5.39562"
          fill={props.di5StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="496.32"
          y="216.12"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.di5StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          DI5
        </text>
      </g>
      <g
        onClick={props.onDo5TopClick}
        className="cursor-pointer group"
        filter="url(#filter7_dddd_274_395)"
      >
        <rect
          width="158.387"
          height="39.1182"
          rx="5.39562"
          transform="matrix(-1 0 0 1 575.764 255.594)"
          fill={props.do5TopStatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="496.57"
          y="278.15"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.do5TopStatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          DO5
        </text>
      </g>
      <g
        onClick={props.onDo3Click}
        className="cursor-pointer group"
        filter="url(#filter8_dddd_274_395)"
      >
        <rect
          width="158.387"
          height="39.1182"
          rx="5.39562"
          transform="matrix(-1 0 0 1 575.764 317.643)"
          fill={props.do3StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="496.57"
          y="340.2"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.do3StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          DO3
        </text>
      </g>
      <g
        onClick={props.onDo5BottomClick}
        className="cursor-pointer group"
        filter="url(#filter9_dddd_274_395)"
      >
        <rect
          width="158.387"
          height="39.1182"
          rx="5.39562"
          transform="matrix(-1 0 0 1 575.764 379.693)"
          fill={props.do5BottomStatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="496.57"
          y="402.25"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.do5BottomStatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          DO5
        </text>
      </g>
      <g
        onClick={props.onHart1Click}
        className="cursor-pointer group"
        filter="url(#filter10_dddd_274_395)"
      >
        <rect
          width="158.387"
          height="39.1182"
          rx="5.39562"
          transform="matrix(-1 0 0 1 575.764 441.742)"
          fill={props.hart1StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="496.57"
          y="464.3"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.hart1StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          HART1
        </text>
      </g>
      <g
        onClick={props.onRtdClick}
        className="cursor-pointer group"
        filter="url(#filter12_dddd_274_395)"
      >
        <rect
          width="158.387"
          height="74.1897"
          rx="5.39562"
          transform="matrix(-1 0 0 1 577 503.792)"
          fill={props.rtdStatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="497.8"
          y="540.89"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.rtdStatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          RTD
        </text>
      </g>
      <g
        onClick={props.onAo2Click}
        className="cursor-pointer group"
        filter="url(#filter11_dddd_274_395)"
      >
        <rect
          width="158.387"
          height="39.1182"
          rx="5.39562"
          transform="matrix(-1 0 0 1 575.764 596.866)"
          fill={props.ao2StatusColor}
          className="transition-all group-hover:brightness-110"
        />
        <text
          x="496.57"
          y="619.42"
          textAnchor="middle"
          dy=".3em"
          fill={getTextColor(props.ao2StatusColor)}
          className="text-[19px] font-semibold uppercase pointer-events-none"
        >
          AO2
        </text>
      </g>
    </svg>
  );
};

export default IoCardSvg;
