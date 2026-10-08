// ========================================
// KAWAII PIXEL STUDIO
// PIXEL ART MAKER
// ========================================


// ========================================
// VARIABLES
// ========================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let gridSize = 16;
let cellSize;

let grid;

let currentColor = "#ff7eb6";
let currentTool = "pen";

let isDrawing = false;
let hoveredCell = null;


// ========================================
// PRESET COLORS
// ========================================

const PRESET_COLORS = [

    "#ff7eb6",
    "#ff9fbc",
    "#ffb7d5",
    "#ff6f91",
    "#ff9671",

    "#ffd166",
    "#ffe28a",

    "#9be7c4",
    "#70d6c0",

    "#7bdff2",
    "#5eb5e8",

    "#9b8cff",
    "#b69cff",

    "#d291bc",
    "#c77dff",

    "#8b5e3c",
    "#704f3a",

    "#333333",
    "#ffffff"

];


// ========================================
// INITIALIZE
// ========================================

function init() {

    grid = Array.from(
        { length: gridSize },
        () => Array(gridSize).fill("#ffffff")
    );


    cellSize = Math.floor(
        480 / gridSize
    );


    canvas.width =
        gridSize * cellSize;

    canvas.height =
        gridSize * cellSize;


    render();
}


// ========================================
// RENDER
// ========================================

function render() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (
        let row = 0;
        row < gridSize;
        row++
    ) {

        for (
            let col = 0;
            col < gridSize;
            col++
        ) {

            ctx.fillStyle =
                grid[row][col];


            ctx.fillRect(
                col * cellSize,
                row * cellSize,
                cellSize,
                cellSize
            );


            // Cute soft grid
            ctx.strokeStyle =
                "#eadce4";


            ctx.lineWidth = 1;


            ctx.strokeRect(
                col * cellSize,
                row * cellSize,
                cellSize,
                cellSize
            );
        }
    }


    // ====================================
    // HOVER PREVIEW
    // ====================================

    if (
        hoveredCell &&
        !isDrawing
    ) {

        const {
            row,
            col
        } = hoveredCell;


        ctx.globalAlpha = 0.4;

        ctx.fillStyle =
            currentColor;


        ctx.fillRect(
            col * cellSize,
            row * cellSize,
            cellSize,
            cellSize
        );


        ctx.globalAlpha = 1;
    }
}


// ========================================
// GET CELL FROM MOUSE
// ========================================

function getCellFromMouse(e) {

    const rect =
        canvas.getBoundingClientRect();


    const x =
        e.clientX - rect.left;

    const y =
        e.clientY - rect.top;


    const scaleX =
        canvas.width / rect.width;

    const scaleY =
        canvas.height / rect.height;


    const actualX =
        x * scaleX;

    const actualY =
        y * scaleY;


    const col =
        Math.floor(
            actualX / cellSize
        );


    const row =
        Math.floor(
            actualY / cellSize
        );


    if (
        row < 0 ||
        row >= gridSize ||
        col < 0 ||
        col >= gridSize
    ) {

        return null;
    }


    return {
        row,
        col
    };
}


// ========================================
// PAINT CELL
// ========================================

function paintCell(row, col) {

    if (
        currentTool === "pen"
    ) {

        grid[row][col] =
            currentColor;

    }

    else if (
        currentTool === "eraser"
    ) {

        grid[row][col] =
            "#ffffff";
    }


    render();
}


// ========================================
// MOUSE DOWN
// ========================================

canvas.addEventListener(
    "mousedown",
    (e) => {

        isDrawing = true;


        const cell =
            getCellFromMouse(e);


        if (cell) {

            if (
                currentTool === "fill"
            ) {

                floodFill(
                    cell.row,
                    cell.col,
                    currentColor
                );

            }

            else {

                paintCell(
                    cell.row,
                    cell.col
                );
            }
        }
    }
);


// ========================================
// MOUSE MOVE
// ========================================

canvas.addEventListener(
    "mousemove",
    (e) => {

        const cell =
            getCellFromMouse(e);


        hoveredCell =
            cell;


        if (
            isDrawing &&
            currentTool !== "fill" &&
            cell
        ) {

            paintCell(
                cell.row,
                cell.col
            );

        }

        else {

            render();
        }
    }
);


// ========================================
// MOUSE UP
// ========================================

canvas.addEventListener(
    "mouseup",
    () => {

        isDrawing = false;
    }
);


// ========================================
// MOUSE LEAVE
// ========================================

canvas.addEventListener(
    "mouseleave",
    () => {

        isDrawing = false;

        hoveredCell = null;

        render();
    }
);


// ========================================
// FLOOD FILL
// ========================================

function floodFill(
    row,
    col,
    newColor
) {

    const targetColor =
        grid[row][col];


    if (
        targetColor === newColor
    ) {

        return;
    }


    const stack = [
        [row, col]
    ];


    while (
        stack.length > 0
    ) {

        const [
            r,
            c
        ] = stack.pop();


        if (
            r < 0 ||
            r >= gridSize ||
            c < 0 ||
            c >= gridSize
        ) {

            continue;
        }


        if (
            grid[r][c] !== targetColor
        ) {

            continue;
        }


        grid[r][c] =
            newColor;


        stack.push([
            r - 1,
            c
        ]);


        stack.push([
            r + 1,
            c
        ]);


        stack.push([
            r,
            c - 1
        ]);


        stack.push([
            r,
            c + 1
        ]);
    }


    render();
}


// ========================================
// BUILD COLOR PALETTE
// ========================================

function buildPalette() {

    const palette =
        document.getElementById(
            "color-palette"
        );


    PRESET_COLORS.forEach(
        (color) => {

            const swatch =
                document.createElement(
                    "div"
                );


            swatch.classList.add(
                "color-swatch"
            );


            if (
                color === currentColor
            ) {

                swatch.classList.add(
                    "active"
                );
            }


            swatch.style.backgroundColor =
                color;


            swatch.addEventListener(
                "click",
                () => {

                    currentColor =
                        color;


                    document
                        .getElementById(
                            "custom-color"
                        )
                        .value =
                        color;


                    document
                        .querySelectorAll(
                            ".color-swatch"
                        )
                        .forEach(
                            (s) => {

                                s.classList
                                    .remove(
                                        "active"
                                    );
                            }
                        );


                    swatch.classList.add(
                        "active"
                    );
                }
            );


            palette.appendChild(
                swatch
            );
        }
    );
}


// ========================================
// CUSTOM COLOR
// ========================================

document
    .getElementById(
        "custom-color"
    )
    .addEventListener(
        "input",
        (e) => {

            currentColor =
                e.target.value;


            document
                .querySelectorAll(
                    ".color-swatch"
                )
                .forEach(
                    (s) => {

                        s.classList
                            .remove(
                                "active"
                            );
                    }
                );
        }
    );


// ========================================
// TOOL SWITCHING
// ========================================

document
    .querySelectorAll(
        ".tool-btn"
    )
    .forEach(
        (btn) => {

            btn.addEventListener(
                "click",
                () => {

                    currentTool =
                        btn.dataset.tool;


                    document
                        .querySelectorAll(
                            ".tool-btn"
                        )
                        .forEach(
                            (b) => {

                                b.classList
                                    .remove(
                                        "active"
                                    );
                            }
                        );


                    btn.classList.add(
                        "active"
                    );
                }
            );
        }
    );


// ========================================
// GRID SIZE
// ========================================

document
    .getElementById(
        "grid-size"
    )
    .addEventListener(
        "change",
        (e) => {

            const confirmed =
                confirm(
                    "Changing grid size will clear your canvas. Continue?"
                );


            if (confirmed) {

                gridSize =
                    parseInt(
                        e.target.value
                    );


                init();

            }

            else {

                e.target.value =
                    gridSize;
            }
        }
    );


// ========================================
// EXPORT PNG
// ========================================

document
    .getElementById(
        "export-btn"
    )
    .addEventListener(
        "click",
        () => {

            const exportCanvas =
                document.createElement(
                    "canvas"
                );


            const exportCtx =
                exportCanvas.getContext(
                    "2d"
                );


            const exportCellSize =
                Math.max(
                    16,
                    Math.floor(
                        512 / gridSize
                    )
                );


            exportCanvas.width =
                gridSize *
                exportCellSize;


            exportCanvas.height =
                gridSize *
                exportCellSize;


            for (
                let row = 0;
                row < gridSize;
                row++
            ) {

                for (
                    let col = 0;
                    col < gridSize;
                    col++
                ) {

                    exportCtx.fillStyle =
                        grid[row][col];


                    exportCtx.fillRect(
                        col *
                            exportCellSize,

                        row *
                            exportCellSize,

                        exportCellSize,

                        exportCellSize
                    );
                }
            }


            const link =
                document.createElement(
                    "a"
                );


            link.download =
                "kawaii-pixel-art.png";


            link.href =
                exportCanvas.toDataURL(
                    "image/png"
                );


            link.click();
        }
    );


// ========================================
// START APP
// ========================================

buildPalette();

init();