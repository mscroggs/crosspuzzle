var active_cell = [null, null]

function is_white(entry) {
    if (entry == "*" || entry == "-") {
        return false;
    }
    return true;
}

function is_black(entry) {
    return entry == "*"
}

function click_cell(row, col) {
    var cell = document.getElementById("crosspuzzle-cell-" + row + "-" + col)
    cell.style.backgroundColor = "#FFA366"
}

function crosspuzzle(id, data) {
    var c = document.getElementById(id);
    var content = "";

    // grid
    if(!("grid" in data)) {
        c.innerHTML = "<span style='color:red'>Error: no grid</span>"
        return
    }
    if(data["grid"].length == 0) {
        c.innerHTML = "<span style='color:red'>Error: empty grid</span>"
        return
    }
    if(data["grid"][0].length == 0) {
        c.innerHTML = "<span style='color:red'>Error: empty grid</span>"
        return
    }
    var g = data["grid"]

    var astarts = []
    var alens = []
    var dstarts = []
    var dlens = []
    var number_positions = {}

    var size = [g.length, g[0].length]
    var clue_n = 1;

    content += "<div class='crosspuzzle-grid', style='display:grid;grid-template-rows:repeat(" + size[0] + ", 30px);grid-template-columns:1fr repeat(" + size[1] + ", 30px) 1fr'>"
    for (var row = 0; row < size[0]; row++) {
        if (g[row].length != size[1]) {
            c.innerHTML = "<span style='color:red'>Error: grid rows non-equal lengths</span>"
            return
        }
        for (var col = 0; col < size[1]; col++) {
            var increase = false
            if(is_white(g[row][col]) && (col == 0 || !is_white(g[row][col-1])) && col + 1 < size[1] && is_white(g[row][col + 1])) {
                astarts[astarts.length] = clue_n
                var len = 0;
                while (col + len < size[1] && is_white(g[row][col + len])) {
                    len++;
                }
                alens[alens.length] = len;
                increase = true
            }
            if(is_white(g[row][col]) && (row == 0 || !is_white(g[row-1][col])) && row + 1 < size[0] && is_white(g[row+1][col])) {
                dstarts[dstarts.length] = clue_n
                var len = 0;
                while (row + len < size[0] && is_white(g[row + len][col])) {
                    len++;
                }
                dlens[dlens.length] = len;
                increase = true;
            }
            if(is_white(g[row][col])) {
                content += "<a id='crosspuzzle-cell-" + row + "-" + col + "' class='crosspuzzle-cell crosspuzzle-cell-white' style='grid-row:" + (row+1) + " / span 1;grid-column:" + (col+2) + " / span 1' "
                content += "href='javascript:click_cell(" + row + ", " + col + ")'></a>"
            } else if(is_black(g[row][col])) {
                content += "<div class='crosspuzzle-cell crosspuzzle-cell-black' style='background-color:black;grid-row:" + (row+1) + " / span 1;grid-column:" + (col+2) + " / span 1'>&nbsp;</div>"
            }
            if (increase) {
                number_positions[[row, col]] = clue_n
                clue_n++;
            }
        }
    }
    content += "</div>"

    // clues
    if(!("clues" in data)) {
        c.innerHTML = "<span style='color:red'>Error: no clues</span>"
        return
    }
    if(!("across" in data["clues"])) {
        c.innerHTML = "<span style='color:red'>Error: no across clues</span>"
        return
    }
    if(!("down" in data["clues"])) {
        c.innerHTML = "<span style='color:red'>Error: no down clues</span>"
        return
    }
    content += "<div class='crosspuzzle-clue-container' style='display:grid;grid-template-columns:1fr 20px 1fr'>"
    content += "<div class='crosspuzzle-across' style='grid-column:1 / span 1;grid-row:1 / span 1;"
    content += "display:grid;grid-template-columns:35px 1fr 35px;grid-teplate_rows:repeat(" + (astarts.length + 1) + ", auto)'>"
    content += "<div class='crosspuzzle-clue-title' style='grid-column:1 / span 3;grid-row:1 / span 1'>Across</div>"
    for (i in data["clues"]["across"]) {
        content += "<div class='crosspuzzle-clue-n' style='grid-column:1 / span 1;grid-row: " + (i + 2) + " / span 1'>"
        content += astarts[i] + "</div>"
        content += "<div class='crosspuzzle-clue-text' style='grid-column:2 / span 1;grid-row: " + (i + 2) + " / span 1'>"
        content += data["clues"]["across"][i] + "</div>"
        content += "<div class='crosspuzzle-clue-len' style='grid-column:3 / span 1;grid-row: " + (i + 2) + " / span 1'>("
        content += alens[i] + ")</div>"
    }
    content += "</div>"

    content += "<div class='crosspuzzle-down' style='grid-column:3 / span 1;grid-row:1 / span 1;"
    content += "display:grid;grid-template-columns:35px 1fr 35px;grid-teplate_rows:repeat(" + (dstarts.length + 1) + ", auto)'>"
    content += "<div class='crosspuzzle-clue-title' style='grid-column:1 / span 3;grid-row:1 / span 1'>Down</div>"
    for (i in data["clues"]["down"]) {
        content += "<div class='crosspuzzle-clue-n' style='grid-column:1 / span 1;grid-row: " + (i + 2) + " / span 1'>"
        content += dstarts[i] + "</div>"
        content += "<div class='crosspuzzle-clue-text' style='grid-column:2 / span 1;grid-row: " + (i + 2) + " / span 1'>"
        content += data["clues"]["down"][i] + "</div>"
        content += "<div class='crosspuzzle-clue-len' style='grid-column:3 / span 1;grid-row: " + (i + 2) + " / span 1'>("
        content += dlens[i] + ")</div>"
    }
    content += "</div>"

    c.innerHTML = content
}
