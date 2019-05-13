
// todo: move to styles
export default  {
    POSITIVE_COLOR: "#eecc00",
    HEALTHY_COLOR: "#00ee11",
    DISEASED_COLOR: "#ff3300",
    TEST_NEG_HEALTHY: "#00ff00",
    TEST_NEG_DISEASED: "#cc0044",
    format,
}

function format(value, decimals) {
    return value.toLocaleString(undefined, { maximumFractionDigits: decimals });
}
