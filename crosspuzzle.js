/***********************************/
/* Crosspuzzle v0.0.1              */
/*                                 */
/* Created by Matthew Scroggs      */
/* Released under MIT license      */
/*                                 */
/* github.com/mscroggs/crosspuzzle */
/***********************************/

var crosspuzzle_active_cell = [null, [null, null], "a"];
var crosspuzzle_all_white_cells = {};
var crosspuzzle_entered = {};
var crosspuzzle_sizes = {};
var crosspuzzle_letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var crosspuzzle_n_to_clue = {};
var crosspuzzle_clue_to_positions = {};

var crosspuzzle_settings = {
    "cell_size": "35px"
};

function crosspuzzle_is_white(id, entry) {
    for (i in crosspuzzle_all_white_cells[id]) {
        if (crosspuzzle_all_white_cells[id][i][0] == entry[0] && crosspuzzle_all_white_cells[id][i][1] == entry[1]) {
            return true;
        }
    }
    return false;
}

function crosspuzzle_entry_is_white(entry) {
    if (entry == "*" || entry == "-") {
        return false;
    }
    return true;
}

function crosspuzzle_entry_is_black(entry) {
    return entry == "*";
}

function crosspuzzle_update_cell_styling(id) {
    for (i in crosspuzzle_all_white_cells[id]) {
        var cell = crosspuzzle_get_cell(id, crosspuzzle_all_white_cells[id][i]);
        cell.className = "crosspuzzle-cell crosspuzzle-cell-white";
    }
    if (id == crosspuzzle_active_cell[0]) {
        var d = crosspuzzle_active_cell[2]
        var clue_n = crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])][d];
        for (i in crosspuzzle_clue_to_positions[id][d][clue_n]) {
            var cell = crosspuzzle_get_cell(id, crosspuzzle_clue_to_positions[id][d][clue_n][i]);
            cell.className = "crosspuzzle-cell crosspuzzle-cell-white crosspuzzle-cell-clue-active";
        }
        var cell = crosspuzzle_get_cell(id, crosspuzzle_active_cell[1]);
        cell.className = "crosspuzzle-cell crosspuzzle-cell-white crosspuzzle-cell-active";
    }
}

function crosspuzzle_n(id, pos) {
    return pos[0] * crosspuzzle_sizes[id][1] + pos[1];
}

function crosspuzzle_get_cell_id(id, pos) {
    return "crosspuzzle-" + id + "-cell-" + pos[0] + "-" + pos[1];
}

function crosspuzzle_get_cell(id, pos) {
    return document.getElementById(crosspuzzle_get_cell_id(id, pos))
}

function crosspuzzle_click_cell(id, row, col) {
    if (crosspuzzle_active_cell[0] != id) {
        crosspuzzle_active_cell = [id, [null, null], "a"];
    }
    if (crosspuzzle_active_cell[1][0] == row && crosspuzzle_active_cell[1][1] == col) {
        if (crosspuzzle_active_cell[2] == "a") {
            crosspuzzle_active_cell[2] = "d";
        } else {
            crosspuzzle_active_cell[2] = "a";
        }
    } else {
        crosspuzzle_active_cell[1] = [row, col];
    }
    crosspuzzle_update_cell_styling(id);
}

function crosspuzzle(id, data) {
    var c = document.getElementById(id);
    var content = "";
    crosspuzzle_all_white_cells[id] = [];
    crosspuzzle_entered[id] = {};
    crosspuzzle_n_to_clue[id] = {};
    crosspuzzle_clue_to_positions[id] = {"a": [], "d": []};

    // grid
    if(!("grid" in data)) {
        c.innerHTML = "<span style='color:red'>Error: no grid</span>";
        return;
    }
    if(data["grid"].length == 0) {
        c.innerHTML = "<span style='color:red'>Error: empty grid</span>";
        return;
    }
    if(data["grid"][0].length == 0) {
        c.innerHTML = "<span style='color:red'>Error: empty grid</span>";
        return;
    }
    var g = data["grid"];

    var astarts = [];
    var alens = [];
    var dstarts = [];
    var dlens = [];

    crosspuzzle_sizes[id] = [g.length, g[0].length];
    var clue_n = 1;

    content += "<div class='crosspuzzle-grid', style='display:grid;grid-template-rows:repeat(" + crosspuzzle_sizes[id][0] + ", " + crosspuzzle_settings["cell_size"] + ");grid-template-columns:1fr repeat(" + crosspuzzle_sizes[id][1] + ", " + crosspuzzle_settings["cell_size"] + ") 1fr'>"
    for (var row = 0; row < crosspuzzle_sizes[id][0]; row++) {
        if (g[row].length != crosspuzzle_sizes[id][1]) {
            c.innerHTML = "<span style='color:red'>Error: grid rows non-equal lengths</span>";
            return;
        }
        for (var col = 0; col < crosspuzzle_sizes[id][1]; col++) {
            var increase = false;
            if(crosspuzzle_entry_is_white(g[row][col]) && (col == 0 || !crosspuzzle_entry_is_white(g[row][col-1])) && col + 1 < crosspuzzle_sizes[id][1] && crosspuzzle_entry_is_white(g[row][col + 1])) {
                crosspuzzle_clue_to_positions[id]["a"][astarts.length] = [];
                var len = 0;
                while (col + len < crosspuzzle_sizes[id][1] && crosspuzzle_entry_is_white(g[row][col + len])) {
                    var n = crosspuzzle_n(id, [row, col + len]);
                    if(!(n in crosspuzzle_n_to_clue[id])){
                        crosspuzzle_n_to_clue[id][n] = {};
                    }
                    crosspuzzle_n_to_clue[id][n]["a"] = astarts.length;
                    crosspuzzle_clue_to_positions[id]["a"][astarts.length][len] = [row, col + len];
                    len++;
                }
                astarts[astarts.length] = clue_n;
                alens[alens.length] = len;
                increase = true;
            }
            if(crosspuzzle_entry_is_white(g[row][col]) && (row == 0 || !crosspuzzle_entry_is_white(g[row-1][col])) && row + 1 < crosspuzzle_sizes[id][0] && crosspuzzle_entry_is_white(g[row+1][col])) {
                crosspuzzle_clue_to_positions[id]["d"][dstarts.length] = [];
                var len = 0;
                while (row + len < crosspuzzle_sizes[id][0] && crosspuzzle_entry_is_white(g[row + len][col])) {
                    var n = crosspuzzle_n(id, [row + len, col]);
                    if(!(n in crosspuzzle_n_to_clue[id])){
                        crosspuzzle_n_to_clue[id][n] = {};
                    }
                    crosspuzzle_n_to_clue[id][n]["d"] = dstarts.length;
                    crosspuzzle_clue_to_positions[id]["d"][dstarts.length][len] = [row + len, col];
                    len++;
                }
                dstarts[dstarts.length] = clue_n;
                dlens[dlens.length] = len;
                increase = true;
            }
            if(crosspuzzle_entry_is_white(g[row][col])) {
                crosspuzzle_all_white_cells[id][crosspuzzle_all_white_cells[id].length] = [row, col];
                content += "<a id='" + crosspuzzle_get_cell_id(id, [row, col]) + "' class='crosspuzzle-cell crosspuzzle-cell-white' style='line-height:" + crosspuzzle_settings["cell_size"] + ";grid-row:" + (row+1) + " / span 1;grid-column:" + (col+2) + " / span 1' ";
                content += "href='javascript:crosspuzzle_click_cell(\"" + id + "\", " + row + ", " + col + ")'></a>";
            } else if(crosspuzzle_entry_is_black(g[row][col])) {
                content += "<div class='crosspuzzle-cell crosspuzzle-cell-black' style='grid-row:" + (row+1) + " / span 1;grid-column:" + (col+2) + " / span 1'>&nbsp;</div>";
            }
            if (increase) {
                content += "<div class='crosspuzzle-clue-n-in-grid' style='grid-row:" + (row+1) + " / span 1;grid-column:" + (col+2) + " / span 1'>" + clue_n + "</div>";
                clue_n++;
            }
        }
    }
    content += "</div>";

    // clues
    if(!("clues" in data)) {
        c.innerHTML = "<span style='color:red'>Error: no clues</span>";
        return;
    }
    if(!("across" in data["clues"])) {
        c.innerHTML = "<span style='color:red'>Error: no across clues</span>";
        return;
    }
    if(!("down" in data["clues"])) {
        c.innerHTML = "<span style='color:red'>Error: no down clues</span>";
        return;
    }
    content += "<div class='crosspuzzle-clue-container' style='display:grid'>";
    content += "<div class='crosspuzzle-across' style='grid-column:1 / span 1;grid-row:1 / span 1;";
    content += "display:grid;grid-template-columns:35px 1fr 35px;grid-teplate_rows:repeat(" + (astarts.length + 1) + ", auto)'>";
    content += "<div class='crosspuzzle-clue-title' style='grid-column:1 / span 3;grid-row:1 / span 1'>Across</div>";
    for (i in data["clues"]["across"]) {
        content += "<div class='crosspuzzle-clue-n' style='grid-column:1 / span 1;grid-row:" + (i + 2) + " / span 1'>";
        content += astarts[i] + "</div>";
        content += "<div class='crosspuzzle-clue-text' style='grid-column:2 / span 1;grid-row:" + (i + 2) + " / span 1'>";
        content += data["clues"]["across"][i] + "</div>";
        content += "<div class='crosspuzzle-clue-len' style='grid-column:3 / span 1;grid-row:" + (i + 2) + " / span 1'>(";
        content += alens[i] + ")</div>";
    }
    content += "</div>";

    content += "<div class='crosspuzzle-down' style='grid-column:3 / span 1;grid-row:1 / span 1;";
    content += "display:grid;grid-template-columns:35px 1fr 35px;grid-teplate_rows:repeat(" + (dstarts.length + 1) + ", auto)'>";
    content += "<div class='crosspuzzle-clue-title' style='grid-column:1 / span 3;grid-row:1 / span 1'>Down</div>";
    for (i in data["clues"]["down"]) {
        content += "<div class='crosspuzzle-clue-n' style='grid-column:1 / span 1;grid-row:" + (i + 2) + " / span 1'>";
        content += dstarts[i] + "</div>";
        content += "<div class='crosspuzzle-clue-text' style='grid-column:2 / span 1;grid-row:" + (i + 2) + " / span 1'>";
        content += data["clues"]["down"][i] + "</div>";
        content += "<div class='crosspuzzle-clue-len' style='grid-column:3 / span 1;grid-row:" + (i + 2) + " / span 1'>(";
        content += dlens[i] + ")</div>";
    }
    content += "</div>";

    c.innerHTML = content;
}

document.addEventListener("keydown", (e) => {
    var id = crosspuzzle_active_cell[0];
    if(id !== null) {
        if(["Enter","Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) {
            e.preventDefault();
        }
        if (e.code === "Escape") {
            crosspuzzle_active_cell = [null, [null, null], "a"];
            crosspuzzle_update_cell_styling(id);
            return;
        }
        if (e.code === "Space") {
            if (crosspuzzle_active_cell[2] == "a") {
                crosspuzzle_active_cell[2] = "d";
            } else {
                crosspuzzle_active_cell[2] = "a";
            }
            crosspuzzle_update_cell_styling(id);
            return;
        }
        if (crosspuzzle_active_cell[1][0] !== null) {
            if (e.code === "ArrowUp") {
                crosspuzzle_active_cell[2] = "d";
                if (crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0] - 1, crosspuzzle_active_cell[1][1]])) {
                    crosspuzzle_active_cell[1][0] -= 1;
                }
                crosspuzzle_update_cell_styling(id);
                return;
            }
            if (e.code === "ArrowDown") {
                crosspuzzle_active_cell[2] = "d";
                if (crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0] + 1, crosspuzzle_active_cell[1][1]])) {
                    crosspuzzle_active_cell[1][0] += 1;
                }
                crosspuzzle_update_cell_styling(id);
                return;
            }
            if (e.code === "ArrowRight") {
                crosspuzzle_active_cell[2] = "a";
                if (crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0], crosspuzzle_active_cell[1][1] + 1])) {
                    crosspuzzle_active_cell[1][1] += 1;
                }
                crosspuzzle_update_cell_styling(id);
                return;
            }
            if (e.code === "ArrowLeft") {
                crosspuzzle_active_cell[2] = "a";
                if (crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0], crosspuzzle_active_cell[1][1] - 1])) {
                    crosspuzzle_active_cell[1][1] -= 1;
                }
                crosspuzzle_update_cell_styling(id);
                return;
            }
            if (e.code === "Backspace") {
                crosspuzzle_get_cell(id, crosspuzzle_active_cell[1]).innerHTML = "";
                delete crosspuzzle_entered[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])]
                if (crosspuzzle_active_cell[2] == "a" && crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0], crosspuzzle_active_cell[1][1] - 1])) {
                    crosspuzzle_active_cell[1][1] -= 1;
                } else if (crosspuzzle_active_cell[2] == "d" && crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0] - 1, crosspuzzle_active_cell[1][1]])) {
                    crosspuzzle_active_cell[1][0] -= 1;
                }
                crosspuzzle_update_cell_styling(id);
                return;
            }
            if (e.code === "Delete") {
                crosspuzzle_get_cell(id, crosspuzzle_active_cell[1]).innerHTML = "";
                delete crosspuzzle_entered[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])]
                return;
            }
            if (e.code === "Enter") {
                var active_clue = crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])][crosspuzzle_active_cell[2]];
                if (crosspuzzle_active_cell[2] == "a") {
                    if (active_clue + 1 < crosspuzzle_clue_to_positions[id]["a"].length) {
                        crosspuzzle_active_cell[1] = crosspuzzle_clue_to_positions[id]["a"][active_clue + 1][0];
                    } else {
                        crosspuzzle_active_cell[1] = crosspuzzle_clue_to_positions[id]["d"][0][0];
                        crosspuzzle_active_cell[2] = "d";
                    }
                } else {
                    if (active_clue + 1 < crosspuzzle_clue_to_positions[id]["d"].length) {
                        crosspuzzle_active_cell[1] = crosspuzzle_clue_to_positions[id]["d"][active_clue + 1][0];
                    }
                }
                crosspuzzle_update_cell_styling(id);
                return;
            }
            for (i in crosspuzzle_letters) {
                var c = crosspuzzle_letters[i];
                if (e.code == "Key" + c) {
                    crosspuzzle_entered[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])] = c;
                    crosspuzzle_get_cell(id, crosspuzzle_active_cell[1]).innerHTML = c;
                    if (crosspuzzle_active_cell[2] == "a") {
                        if (crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0], crosspuzzle_active_cell[1][1] + 1])) {
                            crosspuzzle_active_cell[1][1] += 1;
                        } else {
                            var r = crosspuzzle_active_cell[1][0];
                            var c = crosspuzzle_active_cell[1][1] + 1;
                            while (!crosspuzzle_is_white(id, [r, c])) {
                                c += 1;
                                if (c >= crosspuzzle_sizes[id][1]) {
                                    c = 0;
                                    r += 1;
                                }
                                if (r >= crosspuzzle_sizes[id][0]) {
                                    crosspuzzle_active_cell[2] = "d";
                                    crosspuzzle_active_cell[1] = [-1, 0];
                                    break;
                                }
                            }
                            if (crosspuzzle_active_cell[2] != "d") {
                                crosspuzzle_active_cell[1] = [r, c];
                            }
                        }
                    }
                    if (crosspuzzle_active_cell[2] == "d") {
                        if (crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0] + 1, crosspuzzle_active_cell[1][1]])) {
                            crosspuzzle_active_cell[1][0] += 1;
                        } else {
                            var r = crosspuzzle_active_cell[1][0];
                            var c = crosspuzzle_active_cell[1][1];
                            while (crosspuzzle_is_white(id, [r-1, c])) {
                                r -= 1;
                            }
                            var first = true;
                            while (first || !crosspuzzle_is_white(id, [r, c]) || crosspuzzle_is_white(id, [r-1, c]) || !crosspuzzle_is_white(id, [r+1, c])) {
                                first = false;
                                c += 1;
                                if (c >= crosspuzzle_sizes[id][1]) {
                                    c = 0;
                                    r += 1;
                                }
                                if (r >= crosspuzzle_sizes[id][0]) {
                                    break;
                                }
                            }
                            if (crosspuzzle_is_white(id, [r, c]) && !crosspuzzle_is_white(id, [r-1, c]) && crosspuzzle_is_white(id, [r+1, c])) {
                                crosspuzzle_active_cell[1] = [r, c];
                            }
                        }
                    }
                    crosspuzzle_update_cell_styling(id);
                    return;
                }
            }
        }
/*
        } else if (e.code === \"Backspace\") {
            regex_solution[selected_cell[0]][selected_cell[1]] = \"\"
            if (dir == \"v\" && selected_cell[0] > 0) {
                select_regex_cell(selected_cell[0] - 1, selected_cell[1])
            }
            if (dir == \"h\" && selected_cell[1] > 0) {
                select_regex_cell(selected_cell[0], selected_cell[1] - 1)
            }
            update_solution()
*/
    }
});
