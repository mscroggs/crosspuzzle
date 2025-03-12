/***********************************/
/* Crosspuzzle v0.1.0              */
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
var crosspuzzle_letters = {};
var crosspuzzle_n_to_clue = {};
var crosspuzzle_clue_to_positions = {};
var crosspuzzle_solution = {}
var crosspuzzle_checked = {}
var crosspuzzle_revealed = {}
var crosspuzzle_settings = {}

function crosspuzzle_is_white(id, entry) {
    for (var i in crosspuzzle_all_white_cells[id]) {
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
    for (var id2 in crosspuzzle_solution) {
        document.getElementById("crosspuzzle-" + id2 + "-button-clear-this").disabled = true;
        if (crosspuzzle_solution[id2] !== null) {
            document.getElementById("crosspuzzle-" + id2 + "-button-check-this").disabled = true;
            if (crosspuzzle_settings[id2]["show_reveal_button"]) {
                document.getElementById("crosspuzzle-" + id2 + "-button-reveal-this").disabled = true;
            }
        }
    }
    for (var i in crosspuzzle_all_white_cells[id]) {
        var cell = crosspuzzle_get_cell(id, crosspuzzle_all_white_cells[id][i]);
        cell.className = "crosspuzzle-cell crosspuzzle-cell-white";
    }
    for (var dn = 0; dn < 2; dn++) {
        var d = ["a", "d"][dn];
        for (var i in crosspuzzle_clue_to_positions[id][d]) {
            var clue_n = document.getElementById("crosspuzzle-" + id + "-clue-n-" + d + i);
            clue_n.className = "crosspuzzle-clue-n";
            var clue_text = document.getElementById("crosspuzzle-" + id + "-clue-text-" + d + i);
            clue_text.className = "crosspuzzle-clue-text";
            var clue_len = document.getElementById("crosspuzzle-" + id + "-clue-len-" + d + i);
            clue_len.className = "crosspuzzle-clue-len";
        }
    }
    if (id == crosspuzzle_active_cell[0]) {
        document.getElementById("crosspuzzle-" + id + "-button-clear-this").disabled = false;
        if (crosspuzzle_solution[id] !== null) {
            document.getElementById("crosspuzzle-" + id + "-button-check-this").disabled = false;
            if (crosspuzzle_settings[id]["show_reveal_button"]) {
                document.getElementById("crosspuzzle-" + id + "-button-reveal-this").disabled = false;
            }
        }
        var d = crosspuzzle_active_cell[2]
        var clue_n = crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])][d];
        for (var i in crosspuzzle_clue_to_positions[id][d][clue_n]) {
            var cell = crosspuzzle_get_cell(id, crosspuzzle_clue_to_positions[id][d][clue_n][i]);
            cell.className = "crosspuzzle-cell crosspuzzle-cell-white crosspuzzle-cell-clue-active";
        }
        var cell = crosspuzzle_get_cell(id, crosspuzzle_active_cell[1]);
        cell.className = "crosspuzzle-cell crosspuzzle-cell-white crosspuzzle-cell-active";

        var clue_n_ = document.getElementById("crosspuzzle-" + id + "-clue-n-" + d + clue_n);
        clue_n_.className = "crosspuzzle-clue-n crosspuzzle-clue-active";
        var clue_text = document.getElementById("crosspuzzle-" + id + "-clue-text-" + d + clue_n);
        clue_text.className = "crosspuzzle-clue-text crosspuzzle-clue-active";
        var clue_len = document.getElementById("crosspuzzle-" + id + "-clue-len-" + d + clue_n);
        clue_len.className = "crosspuzzle-clue-len crosspuzzle-clue-active";

        document.getElementById("crosspuzzle-" + id + "-active-clue").innerHTML =
            clue_n_.innerHTML + " &nbsp; " + clue_text.innerHTML + " &nbsp; " + clue_len.innerHTML;
    } else {
        document.getElementById("crosspuzzle-" + id + "-active-clue").innerHTML = "&nbsp;";
    }

    var remove = []
    for (var i in crosspuzzle_checked[id]) {
        var pos = crosspuzzle_solution[id][i][0];
        if (!(i in crosspuzzle_revealed[id]) && i in crosspuzzle_entered[id] && crosspuzzle_entered[id][i][0] == crosspuzzle_checked[id][i][0]) {
            if (crosspuzzle_checked[id][i][1]) {
                crosspuzzle_get_cell(id, pos).className += " crosspuzzle-cell-correct";
            } else {
                crosspuzzle_get_cell(id, pos).className += " crosspuzzle-cell-incorrect";
            }
        } else {
            remove[remove.length] = i;
        }
    }
    for (var i in remove) {
        delete crosspuzzle_checked[id][remove[i]];
    }
    for (var i in crosspuzzle_revealed[id]) {
        var pos = crosspuzzle_solution[id][i][0];
        crosspuzzle_get_cell(id, pos).className += " crosspuzzle-cell-correct";
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

function crosspuzzle_click_cell(id, row, col, direction) {
    if (crosspuzzle_active_cell[0] != id) {
        crosspuzzle_active_cell = [id, [null, null], "a"];
    }
    if (crosspuzzle_active_cell[1][0] == row && crosspuzzle_active_cell[1][1] == col) {
        if (crosspuzzle_active_cell[2] == "a" && "d" in crosspuzzle_n_to_clue[id][crosspuzzle_n(id, [row, col])]) {
            crosspuzzle_active_cell[2] = "d";
        } else if (crosspuzzle_active_cell[2] == "d" && "a" in crosspuzzle_n_to_clue[id][crosspuzzle_n(id, [row, col])]) {
            crosspuzzle_active_cell[2] = "a";
        }
    } else {
        if (!("d" in crosspuzzle_n_to_clue[id][crosspuzzle_n(id, [row, col])])) {
            crosspuzzle_active_cell[2] = "a";
        }
        if (!("a" in crosspuzzle_n_to_clue[id][crosspuzzle_n(id, [row, col])])) {
            crosspuzzle_active_cell[2] = "d";
        }
        crosspuzzle_active_cell[1] = [row, col];
    }
    if (direction != "none") {
            crosspuzzle_active_cell[2] = direction;
    }
    document.getElementById("crosspuzzle-" + id + "-input").focus();
    crosspuzzle_update_cell_styling(id);
}

function crosspuzzle_clear_this(id) {
    if (crosspuzzle_active_cell[0] == id) {
        var active_clue = crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])][crosspuzzle_active_cell[2]];
        var positions = crosspuzzle_clue_to_positions[id][crosspuzzle_active_cell[2]][active_clue];
        for (var p in positions) {
            var pos = positions[p];
            if (!(crosspuzzle_n(id, pos) in crosspuzzle_revealed[id])) {
                if (crosspuzzle_n(id, pos) in crosspuzzle_entered[id]) {
                    delete crosspuzzle_entered[id][crosspuzzle_n(id, pos)];
                    crosspuzzle_get_cell(id, pos).innerHTML = "";
                }
                if (crosspuzzle_n(id, pos) in crosspuzzle_checked[id]) {
                    delete crosspuzzle_checked[id][crosspuzzle_n(id, pos)];
                }
            }
        }
        crosspuzzle_update_cell_styling(id);
    }
}

function crosspuzzle_clear_all(id) {
    for (var i in crosspuzzle_entered[id]) {
        if (!(i in crosspuzzle_revealed[id])) {
            crosspuzzle_get_cell(id, crosspuzzle_solution[id][i][0]).innerHTML = "";
            delete crosspuzzle_entered[id][i];
            if (i in crosspuzzle_checked[id]) {
                delete crosspuzzle_checked[id][i];
            }
        }
    }
    crosspuzzle_update_cell_styling(id);
}

function crosspuzzle_check_this(id) {
    if (crosspuzzle_active_cell[0] == id) {
        var active_clue = crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])][crosspuzzle_active_cell[2]];
        var positions = crosspuzzle_clue_to_positions[id][crosspuzzle_active_cell[2]][active_clue];
        for (var p in positions) {
            var pos = positions[p];
            var c = crosspuzzle_solution[id][crosspuzzle_n(id, pos)][1];
            if (crosspuzzle_n(id, pos) in crosspuzzle_entered[id]) {
                crosspuzzle_checked[id][crosspuzzle_n(id, pos)] = [crosspuzzle_entered[id][crosspuzzle_n(id, pos)], crosspuzzle_entered[id][crosspuzzle_n(id, pos)] == c];
            }
        }
        crosspuzzle_active_cell = [null, [null, null], "a"];
        crosspuzzle_update_cell_styling(id);
    }
}

function crosspuzzle_check_all(id) {
    for (var i in crosspuzzle_solution[id]) {
        var pos = crosspuzzle_solution[id][i][0];
        var c = crosspuzzle_solution[id][i][1];
        if (crosspuzzle_n(id, pos) in crosspuzzle_entered[id]) {
            crosspuzzle_checked[id][crosspuzzle_n(id, pos)] = [crosspuzzle_entered[id][crosspuzzle_n(id, pos)], crosspuzzle_entered[id][crosspuzzle_n(id, pos)] == c];
        }
    }
    crosspuzzle_active_cell = [null, [null, null], "a"];
    crosspuzzle_update_cell_styling(id);
}

function crosspuzzle_reveal_this(id) {
    if (crosspuzzle_active_cell[0] == id) {
        var active_clue = crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])][crosspuzzle_active_cell[2]];
        var positions = crosspuzzle_clue_to_positions[id][crosspuzzle_active_cell[2]][active_clue];
        for (var p in positions) {
            var pos = positions[p];
            var c = crosspuzzle_solution[id][crosspuzzle_n(id, pos)][1];
            crosspuzzle_entered[id][crosspuzzle_n(id, pos)] = c;
            crosspuzzle_checked[id][crosspuzzle_n(id, pos)] = [c, true];
            crosspuzzle_get_cell(id, pos).innerHTML = c;
        }
        crosspuzzle_active_cell = [null, [null, null], "a"];
        crosspuzzle_update_cell_styling(id);
    }
}

function crosspuzzle_reveal_all(id) {
    for (var i in crosspuzzle_solution[id]) {
        var pos = crosspuzzle_solution[id][i][0];
        var c = crosspuzzle_solution[id][i][1];
        crosspuzzle_entered[id][crosspuzzle_n(id, pos)] = c;
        crosspuzzle_checked[id][crosspuzzle_n(id, pos)] = [c, true];
        crosspuzzle_get_cell(id, pos).innerHTML = c;
    }
    crosspuzzle_active_cell = [null, [null, null], "a"];
    crosspuzzle_update_cell_styling(id);
}

function crosspuzzle(id, data) {
    var c = document.getElementById(id);
    var content = "";
    crosspuzzle_all_white_cells[id] = [];
    crosspuzzle_entered[id] = {};
    crosspuzzle_n_to_clue[id] = {};
    crosspuzzle_clue_to_positions[id] = {"a": [], "d": []};
    crosspuzzle_solution[id] = {};
    crosspuzzle_checked[id] = {};
    crosspuzzle_revealed[id] = {};
    crosspuzzle_settings[id] = {"show_reveal_button": true};
    if ("show_reveal_button" in data) {
        crosspuzzle_settings[id]["show_reveal_button"] = data["show_reveal_button"];
    }

    // Active clue
    content += "<div class='crosspuzzle-active-clue' id='crosspuzzle-" + id + "-active-clue'>&nbsp;</div>";

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
    if ("valid_chars" in data) {
        crosspuzzle_letters[id] = data["valid_chars"];
    } else {
        crosspuzzle_letters[id] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    var clue_n = 1;

    var cell_size = "35px";
    if ("cell_size" in data) {
        cell_size = data["cell_size"];
    }
    var nwidth = "35px";
    if ("clue_number_width" in data) {
        nwidth = data["clue_number_width"];
    }
    var lenwidth = "35px";
    if ("clue_length_width" in data) {
        lenwidth = data["clue_length_width"];
    }

    if ("custom_numbering" in data) {
        if (data["custom_numbering"].length != crosspuzzle_sizes[id][0]) {
            c.innerHTML = "<span style='color:red'>Error: custom numbering has wrong size</span>";
            return;
        }
        for (var i in data["custom_numbering"]) {
            if (data["custom_numbering"][i].length != crosspuzzle_sizes[id][1]) {
                c.innerHTML = "<span style='color:red'>Error: custom numbering has wrong size</span>";
                return;
            }
        }
    }

    var input_added = false;

    content += "<style type='text/css'>\n";
    content += "#crosspuzzle-" + id + "-grid {";
    content += "display:grid;"
    content += "}\n";
    content += "@media(min-width: 1000px){\n";
    content += "#crosspuzzle-" + id + "-grid {";
    content += "grid-template-rows:repeat(" + crosspuzzle_sizes[id][0] + ", " + cell_size + ");"
    content += "grid-template-columns:1fr repeat(" + crosspuzzle_sizes[id][1] + ", " + cell_size + ") 1fr"
    content += "}\n";
    content += ".crosspuzzle-cell {"
    content += "line-height:" + cell_size + ";"
    content += "}\n";
    content += "}\n";
    var mobile_cell_size = Math.min(10, 90/crosspuzzle_sizes[id][1]) + "vw";
    content += "@media(max-width: 1000px){\n";
    content += "#crosspuzzle-" + id + "-grid {";
    content += "grid-template-rows:repeat(" + crosspuzzle_sizes[id][0] + ", " + mobile_cell_size + ");"
    content += "grid-template-columns:1fr repeat(" + crosspuzzle_sizes[id][1] + ", " + mobile_cell_size + ") 1fr"
    content += "}\n";
    content += "#crosspuzzle-" + id + "-grid .crosspuzzle-cell {"
    content += "line-height:" + mobile_cell_size + ";"
    content += "}\n";
    content += "}\n";
    content += "</style>";
    content += "<div id='crosspuzzle-" + id + "-grid' class='crosspuzzle-grid'>"
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
                if (g[row][col] == "?") {
                    if (crosspuzzle_solution[id] !== null) {
                        if (Object.keys(crosspuzzle_solution[id]).length > 0) {
                            c.innerHTML = "<span style='color:red'>Error: cannot mix revealable and non-revealable characters</span>";
                            return;
                        }
                        crosspuzzle_solution[id] = null
                    }
                } else {
                    if (crosspuzzle_solution[id] === null) {
                        c.innerHTML = "<span style='color:red'>Error: cannot mix revealable and non-revealable characters</span>";
                        return;
                    }
                    if (!crosspuzzle_letters[id].includes(g[row][col])) {
                        c.innerHTML = "<span style='color:red'>Error: invalid character (" + g[row][col] + ")</span>";
                        return;
                    }
                    crosspuzzle_solution[id][crosspuzzle_n(id, [row, col])] = [[row, col], g[row][col]];
                }
                crosspuzzle_all_white_cells[id][crosspuzzle_all_white_cells[id].length] = [row, col];
                if (!input_added) {
                    content += "<textarea id='crosspuzzle-" + id + "-input' class='crosspuzzle-cell-input' style='grid-row:" + (row+1) + " / span 1;grid-column:" + (col+2) + " / span 1;'></textarea>";
                    input_added = true;
                }
                content += "<a id='" + crosspuzzle_get_cell_id(id, [row, col]) + "' class='crosspuzzle-cell crosspuzzle-cell-white' style='grid-row:" + (row+1) + " / span 1;grid-column:" + (col+2) + " / span 1' ";
                content += "href='javascript:crosspuzzle_click_cell(\"" + id + "\", " + row + ", " + col + ", \"none\")'>";
                if ("revealed" in data) {
                    var r = data["revealed"][row][col];
                    if (crosspuzzle_letters[id].includes(r)) {
                        content += r;
                        crosspuzzle_revealed[id][crosspuzzle_n(id, [row, col])] = r;
                    } else if (!"*?-".includes(r)) {
                        c.innerHTML = "<span style='color:red'>Error: invalid revealed character (" + r + ")</span>";
                        return;
                    }
                }
                content += "</a>";
            } else if(crosspuzzle_entry_is_black(g[row][col])) {
                content += "<div class='crosspuzzle-cell crosspuzzle-cell-black' style='grid-row:" + (row+1) + " / span 1;grid-column:" + (col+2) + " / span 1'>&nbsp;</div>";
            }
            if ("custom_numbering" in data) {
                if (data["custom_numbering"][row][col] != "") {
                    content += "<div class='crosspuzzle-clue-n-in-grid' style='grid-row:" + (row+1) + " / span 1;grid-column:" + (col+2) + " / span 1'>";
                    content += data["custom_numbering"][row][col];
                    content += "</div>";
                }
            } else if (increase) {
                content += "<div class='crosspuzzle-clue-n-in-grid' style='grid-row:" + (row+1) + " / span 1;grid-column:" + (col+2) + " / span 1'>";
                if ("custom_numbering" in data) {
                    content += data["custom_numbering"][row][col];
                } else {
                    content += clue_n;
                }
                content += "</div>";
            }
            if (increase) {
                clue_n++;
            }
        }
    }
    content += "</div>";

    // Reveal and check buttons
    content += "<div class='crosspuzzle-reveal'>";
    content += "<button id='crosspuzzle-" + id + "-button-clear-this' onclick='crosspuzzle_clear_this(\"" + id + "\")' disabled>Clear this entry</button>";
    if (crosspuzzle_solution[id] !== null) {
        content += "<button id='crosspuzzle-" + id + "-button-check-this' onclick='crosspuzzle_check_this(\"" + id + "\")' disabled>Check this entry</button>";
        if (crosspuzzle_settings[id]["show_reveal_button"]) {
            content += "<button id='crosspuzzle-" + id + "-button-reveal-this' onclick='crosspuzzle_reveal_this(\"" + id + "\")' disabled>Reveal this entry</button>";
        }
    }
    content += "<button id='crosspuzzle-" + id + "-button-clear-all' onclick='crosspuzzle_clear_all(\"" + id + "\")' >Clear all entries</button>";
    if (crosspuzzle_solution[id] !== null) {
        content += "<button id='crosspuzzle-" + id + "-button-check-all' onclick='crosspuzzle_check_all(\"" + id + "\")' >Check all entries</button>";
        if (crosspuzzle_settings[id]["show_reveal_button"]) {
            content += "<button id='crosspuzzle-" + id + "-button-reveal-all' onclick='crosspuzzle_reveal_all(\"" + id + "\")' >Reveal all entries</button>";
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
    if (data["clues"]["across"].length != crosspuzzle_clue_to_positions[id]["a"].length) {
        c.innerHTML = "<span style='color:red'>Error: not enough across clues</span>";
        return;
    }
    if (data["clues"]["down"].length != crosspuzzle_clue_to_positions[id]["d"].length) {
        c.innerHTML = "<span style='color:red'>Error: not enough down clues</span>";
        return;
    }
    if ("clue_numbers" in data) {
        if (!("across" in data["clue_numbers"]) || !("down" in data["clue_numbers"])) {
            c.innerHTML = "<span style='color:red'>Error: invalid clue numbers</span>";
            return;
        }
        if (data["clues"]["across"].length != data["clue_numbers"]["across"].length) {
            c.innerHTML = "<span style='color:red'>Error: incorrect number of across clue numbers</span>";
            return;
        }
        if (data["clues"]["down"].length != data["clue_numbers"]["down"].length) {
            c.innerHTML = "<span style='color:red'>Error: incorrect number of down clue numbers</span>";
            return;
        }
    }
    content += "<div class='crosspuzzle-clue-container' style='display:grid'>";
    content += "<div class='crosspuzzle-across' style='";
    content += "display:grid;grid-template-columns:" + nwidth + " 1fr " + lenwidth + ";grid-teplate_rows:repeat(" + (astarts.length + 1) + ", auto)'>";
    content += "<div class='crosspuzzle-clue-title' style='grid-column:1 / span 3;grid-row:1 / span 1'>Across</div>";
    for (var i in data["clues"]["across"]) {
        var clue_text = data["clues"]["across"][i];
        var pos = crosspuzzle_clue_to_positions[id]["a"][i][0];
        var href = "href='javascript:crosspuzzle_click_cell(\"" + id + "\", " + pos[0] + ", " + pos[1] + ", \"a\")'"
        content += "<a " + href + " class='crosspuzzle-clue-n' id='crosspuzzle-" + id + "-clue-n-a" + i + "' style='grid-column:1 / span 1;grid-row:" + (i + 2) + " / span 1'>";
        if (clue_text != ":HIDDEN") {
            if ("clue_numbers" in data) {
                content += data["clue_numbers"]["across"][i];
            } else {
                content += astarts[i];
            }
        }
        content += "</a>";
        content += "<a " + href + " class='crosspuzzle-clue-text' id='crosspuzzle-" + id + "-clue-text-a" + i + "' style='grid-column:2 / span 1;grid-row:" + (i + 2) + " / span 1'>";
        if (clue_text != ":HIDDEN") {
            content += clue_text;
        }
        content += "</a>";
        content += "<a " + href + " class='crosspuzzle-clue-len' id='crosspuzzle-" + id + "-clue-len-a" + i + "' style='grid-column:3 / span 1;grid-row:" + (i + 2) + " / span 1'>";
        if (clue_text != ":HIDDEN") {
            content += "(" + alens[i] + ")";
        }
        content += "</a>";
    }
    content += "</div>";

    content += "<div class='crosspuzzle-down' style='";
    content += "display:grid;grid-template-columns:" + nwidth + " 1fr " + lenwidth + ";grid-teplate_rows:repeat(" + (dstarts.length + 1) + ", auto)'>";
    content += "<div class='crosspuzzle-clue-title' style='grid-column:1 / span 3;grid-row:1 / span 1'>Down</div>";
    for (var i in data["clues"]["down"]) {
        var clue_text = data["clues"]["down"][i];
        var pos = crosspuzzle_clue_to_positions[id]["d"][i][0];
        var href = "href='javascript:crosspuzzle_click_cell(\"" + id + "\", " + pos[0] + ", " + pos[1] + ", \"d\")'"
        content += "<a " + href + " class='crosspuzzle-clue-n' id='crosspuzzle-" + id + "-clue-n-d" + i + "' style='grid-column:1 / span 1;grid-row:" + (i + 2) + " / span 1'>";
        if (clue_text != ":HIDDEN") {
            if ("clue_numbers" in data) {
                content += data["clue_numbers"]["down"][i];
            } else {
                content += dstarts[i];
            }
        }
        content += "</a>";
        content += "<a " + href + " class='crosspuzzle-clue-text' id='crosspuzzle-" + id + "-clue-text-d" + i + "' style='grid-column:2 / span 1;grid-row:" + (i + 2) + " / span 1'>";
        if (clue_text != ":HIDDEN") {
            content += clue_text;
        }
        content += "</a>";
        content += "<a " + href + " class='crosspuzzle-clue-len' id='crosspuzzle-" + id + "-clue-len-d" + i + "' style='grid-column:3 / span 1;grid-row:" + (i + 2) + " / span 1'>";
        if (clue_text != ":HIDDEN") {
            content += "(" + dlens[i] + ")";
        }
        content += "</a>";
    }
    content += "</div>";

    c.innerHTML = content;
    crosspuzzle_update_cell_styling(id);
    crosspuzzle_add_input_listener(document.getElementById("crosspuzzle-" + id + "-input"));

}

function crosspuzzle_process_key(id, key_code) {
    if (key_code === "Escape") {
        crosspuzzle_active_cell = [null, [null, null], "a"];
        crosspuzzle_update_cell_styling(id);
        return;
    }
    if (key_code === "Space") {
        if (crosspuzzle_active_cell[2] == "a" && "d" in crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])]) {
            crosspuzzle_active_cell[2] = "d";
        } else if (crosspuzzle_active_cell[2] == "d" && "a" in crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])]) {
            crosspuzzle_active_cell[2] = "a";
        }
        crosspuzzle_update_cell_styling(id);
        return;
    }
    if (crosspuzzle_active_cell[1][0] !== null) {
        if (key_code === "ArrowUp") {
            if ("d" in crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])]) {
                crosspuzzle_active_cell[2] = "d";
                if (crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0] - 1, crosspuzzle_active_cell[1][1]])) {
                    crosspuzzle_active_cell[1][0] -= 1;
                }
                crosspuzzle_update_cell_styling(id);
            }
            return;
        }
        if (key_code === "ArrowDown") {
            if ("d" in crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])]) {
                crosspuzzle_active_cell[2] = "d";
                if (crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0] + 1, crosspuzzle_active_cell[1][1]])) {
                    crosspuzzle_active_cell[1][0] += 1;
                }
                crosspuzzle_update_cell_styling(id);
            }
            return;
        }
        if (key_code === "ArrowRight") {
            if ("a" in crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])]) {
                crosspuzzle_active_cell[2] = "a";
                if (crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0], crosspuzzle_active_cell[1][1] + 1])) {
                    crosspuzzle_active_cell[1][1] += 1;
                }
                crosspuzzle_update_cell_styling(id);
            }
            return;
        }
        if (key_code === "ArrowLeft") {
            if ("a" in crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])]) {
                crosspuzzle_active_cell[2] = "a";
                if (crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0], crosspuzzle_active_cell[1][1] - 1])) {
                    crosspuzzle_active_cell[1][1] -= 1;
                }
                crosspuzzle_update_cell_styling(id);
            }
            return;
        }
        if (key_code === "Backspace") {
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
        if (key_code === "Delete") {
            crosspuzzle_get_cell(id, crosspuzzle_active_cell[1]).innerHTML = "";
            delete crosspuzzle_entered[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])]
            return;
        }
        if (key_code === "Enter") {
            var active_clue = crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])][crosspuzzle_active_cell[2]];
            if (crosspuzzle_active_cell[2] == "a") {
                if (active_clue + 1 < crosspuzzle_clue_to_positions[id]["a"].length) {
                    crosspuzzle_active_cell[1][0] = crosspuzzle_clue_to_positions[id]["a"][active_clue + 1][0][0];
                    crosspuzzle_active_cell[1][1] = crosspuzzle_clue_to_positions[id]["a"][active_clue + 1][0][1];
                } else {
                    crosspuzzle_active_cell[1][0] = crosspuzzle_clue_to_positions[id]["d"][0][0][0];
                    crosspuzzle_active_cell[1][1] = crosspuzzle_clue_to_positions[id]["d"][0][0][1];
                    crosspuzzle_active_cell[2] = "d";
                }
            } else {
                if (active_clue + 1 < crosspuzzle_clue_to_positions[id]["d"].length) {
                    crosspuzzle_active_cell[1][0] = crosspuzzle_clue_to_positions[id]["d"][active_clue + 1][0][0];
                    crosspuzzle_active_cell[1][1] = crosspuzzle_clue_to_positions[id]["d"][active_clue + 1][0][1];
                }
            }
            crosspuzzle_update_cell_styling(id);
            return;
        }
        for (var i in crosspuzzle_letters[id]) {
            var c = crosspuzzle_letters[id][i];
            if (key_code == "Key" + c || key_code == "Digit" + c) {
                if (!(crosspuzzle_n(id, crosspuzzle_active_cell[1]) in crosspuzzle_revealed[id])){
                    crosspuzzle_entered[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])] = c;
                    crosspuzzle_get_cell(id, crosspuzzle_active_cell[1]).innerHTML = c;
                }
                var active_clue = crosspuzzle_n_to_clue[id][crosspuzzle_n(id, crosspuzzle_active_cell[1])][crosspuzzle_active_cell[2]];
                if (crosspuzzle_active_cell[2] == "a") {
                    if (crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0], crosspuzzle_active_cell[1][1] + 1])) {
                        crosspuzzle_active_cell[1][1] += 1;
                    } else {
                        if (active_clue + 1 < crosspuzzle_clue_to_positions[id]["a"].length) {
                            crosspuzzle_active_cell[1][0] = crosspuzzle_clue_to_positions[id]["a"][active_clue + 1][0][0];
                            crosspuzzle_active_cell[1][1] = crosspuzzle_clue_to_positions[id]["a"][active_clue + 1][0][1];
                        } else {
                            crosspuzzle_active_cell[1][0] = crosspuzzle_clue_to_positions[id]["d"][0][0][0];
                            crosspuzzle_active_cell[1][1] = crosspuzzle_clue_to_positions[id]["d"][0][0][1];
                            crosspuzzle_active_cell[2] = "d";
                        }
                    }
                } else {
                    if (crosspuzzle_is_white(id, [crosspuzzle_active_cell[1][0] + 1, crosspuzzle_active_cell[1][1]])) {
                        crosspuzzle_active_cell[1][0] += 1;
                    } else {
                        if (active_clue + 1 < crosspuzzle_clue_to_positions[id]["d"].length) {
                            crosspuzzle_active_cell[1][0] = crosspuzzle_clue_to_positions[id]["d"][active_clue + 1][0][0];
                            crosspuzzle_active_cell[1][1] = crosspuzzle_clue_to_positions[id]["d"][active_clue + 1][0][1];
                        }
                    }
                }
                crosspuzzle_update_cell_styling(id);
                return;
            }
        }
    }
}

document.addEventListener("keydown", (e) => {
    var id = crosspuzzle_active_cell[0];
    if (id !== null) {
        e.preventDefault();
        crosspuzzle_process_key(id, e.code)
    }
});

function crosspuzzle_add_input_listener(obj) {
    obj.value = " ";
    obj.addEventListener("keyup", (e) => {
        var id = crosspuzzle_active_cell[0];
        if (id !== null) {
            var i = document.getElementById("crosspuzzle-" + id + "-input");
            if (i.value.length == 2) {
                var new_char = i.value.substr(1);
                if (new_char == "\n") { crosspuzzle_process_key(id, "Enter"); }
                else if (new_char == " ") { crosspuzzle_process_key(id, "Space"); }
                else if ("01234567889".includes(new_char)) { crosspuzzle_process_key(id, "Digit" + new_char); }
                else { crosspuzzle_process_key(id, "Key" + new_char); }
            } else {
                crosspuzzle_process_key(id, "Backspace");
            }
        }
        obj.value = " ";
    });
}

function crosspuzzle_infer_keycode() {
    var id = crosspuzzle_active_cell[0];
    if (id === null) {
        return "";
    }
    var new_value = document.getElementById("crosspuzzle-" + id + "-input").value;
    alert(new_value);
    return "KeyA";
}

