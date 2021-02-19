const tool_id = 'craft';

let filter_set = new Set();
let or_filter = true;
let keyword_search = false;
let theme = 'normal';

$(document).ready(function(){
    init();
    
    if(location.search) readUrl();
});

$(window).resize(function(){
    $('.side_navigation').css({top: (parseInt($('#top-bar').css('height'))-20)+'px'});
});

function startFilter()
{
    changeUrl();
    
    let skill_set = new Set();
    let mode_set = new Set();
    let attr_set = new Set();
    let race_set = new Set();
    let star_set = new Set();
    let charge_set = new Set();
    
    let isSkillSelected = false;
    let isModeSelected = false;
    let isAttrSelected = false;
    let isRaceSelected = false;
    let isStarSelected = false;
    let isChargeSelected = false;
    
    if(keyword_search == false)
    {
        filter_set.clear();
    
        [skill_set, isSkillSelected] = getSelectedButton('filter');
        [mode_set, isModeSelected] = getSelectedButton('mode');
        [attr_set, isAttrSelected] = getSelectedButton('attr');
        [race_set, isRaceSelected] = getSelectedButton('race');
        [star_set, isStarSelected] = getSelectedButton('star', true);
        [charge_set, isChargeSelected] = getSelectedButton('charge');
        
        $.each(craft_data, (index, craft) => {

            if( (isModeSelected && !mode_set.has(craft.mode)) || 
                (isAttrSelected && !attr_set.has(craft.attribute)) || 
                (isRaceSelected && !race_set.has(craft.race)) || 
                (isStarSelected && !star_set.has(craft.star)) || 
                (isChargeSelected && !charge_set.has(craft.charge))) return;
                
            if(isSkillSelected) {
                let skill_num_array = [];
                
                if(or_filter)       // OR
                {
                    let isSkillMatch = false;
                    $.each([...skill_set], (skill_set_index, selected_feat) => {
                        if(craft.tag.includes(selected_feat)) {
                            isSkillMatch = true;
                            return false;
                        }
                    })
                    
                    if(!isSkillMatch) return;
                }
                else       // AND
                {
                    let isSkillMatch = true;
                    
                    $.each([...skill_set], (skill_set_index, selected_feat) => {
                        if(!(craft.tag.includes(selected_feat))) {
                            isSkillMatch = false;
                            return false;
                        }
                    })
                    
                    if(!isSkillMatch) return;
                }
            }
            craft.tag.length > 0 && filter_set.add(craft.id);
        })
    }
    else        // keyword search mode
    {
        filter_set.clear();
    
        let keyword_set = checkKeyword();
        if(!keyword_set) return;
        
        [mode_set, isModeSelected] = getSelectedButton('mode');
        [attr_set, isAttrSelected] = getSelectedButton('attr');
        [race_set, isRaceSelected] = getSelectedButton('race');
        [star_set, isStarSelected] = getSelectedButton('star', true);
        [charge_set, isChargeSelected] = getSelectedButton('charge');
        
        $.each(craft_data, (index, craft) => {
            if( (isModeSelected && !mode_set.has(craft.mode)) || 
                (isAttrSelected && !attr_set.has(craft.attribute)) || 
                (isRaceSelected && !race_set.has(craft.race)) || 
                (isStarSelected && !star_set.has(craft.star)) || 
                (isChargeSelected && !charge_set.has(craft.charge))) return;
            
            $.each(craft.description, (desc_index, skill_desc) => {
                
                let sanitized_skill_desc = textSanitizer(skill_desc);
                
                if(or_filter)
                {
                    let isKeywordChecked = false;
                    
                    $.each([...keyword_set], (keyword_index, keyword) => {
                        if(sanitized_skill_desc.includes(keyword))
                        {
                            isKeywordChecked = true;
                            return false;
                        }
                    })
                    
                    if(!isKeywordChecked) return;
                }
                else
                {
                    let isKeywordChecked = true;
                    
                    $.each([...keyword_set], (keyword_index, keyword) => {
                        if(!sanitized_skill_desc.includes(keyword))
                        {
                            isKeywordChecked = false;
                            return false;
                        }
                    })
                    
                    if(!isKeywordChecked) return;
                }
                craft.tag.length > 0 && filter_set.add(craft.id);
            })
        })
    }
    
    
    $(".row.result-row").show();
    
    let craft_array = [...filter_set];
    
    $("#result-row").html(() => {
        let str = "";
            
        if(craft_array.length != 0)
        {
            craft_array.sort((a, b) => a - b);
            $.each(craft_array, (index, craft_id) => {
                let sk_str = renderCraftInfo(craft_id);
                str += renderCraftImage(craft_id, sk_str);
            });
        }
        else
        {
            str = `<div class='col-12' style='padding-top: 20px; text-align: center; color: #888888;'><h1>查無結果</h1></div>`;
        }
        return str;
    });
    
    $('.result').tooltip(
        {
            boundary: 'scrollParent', 
            placement: 'auto', 
            container: 'body'
        }
    );
    
    $(".search_tag").html(function(){
        let tag_html = "";
        
        tag_html += (!keyword_search) ? renderTags(skill_set, 'skill') : '';
        tag_html += renderTags(mode_set, 'genre');
        tag_html += renderTags(attr_set, 'genre');
        tag_html += renderTags(race_set, 'genre');
        tag_html += renderTags(star_set, 'genre', ' ★');
        tag_html += renderTags(charge_set, 'genre');
        
        return tag_html;
    });
    
    $('[data-toggle=popover]').popover({
        container: 'body',
        html: true,
        trigger: 'focus',
        placement: 'bottom'
    });
    
    jumpTo("result_title");
}

function renderCraftInfo(craft_id) {
    let sk_str = "";
    let skill = craft_data.find((element) => {
        return element.id == craft_id;
    }).description;
    
    $.each(skill, (desc_index, desc) => {
        if(desc_index > 0) sk_str += `<hr style='margin: 5px 0;'>`;
    
        sk_str += `
            <div class='skill_tooltip skill_description'>
                <img src='../tos_tool_data/img/craft/skill_${desc_index + 1}.png' />
                &nbsp;${desc}
            </div>
        `;
    });
    
    return sk_str;
}

function renderCraftImage(craft_id, sk_str) {
    return `
        <div class="col-3 col-md-2 col-lg-1 result">
            <img class="monster_img" src="../tos_tool_data/img/craft/${craft_id}.png" onerror="this.src='../tos_tool_data/img/craft/noname.png'" tabindex=${craft_id} data-toggle="popover" data-title="" data-content="${sk_str}"></img>
            <div class="monsterId">
                <a href="https://tos.fandom.com/zh/wiki/C${paddingZeros(craft_id, 2)}" target="_blank">
                    ${paddingZeros(craft_id, 3)}
                </a>
            </div>
        </div>
    `;
}

function changeUrl()
{
    let search_str = `${!keyword_search ? `search=${encode(".filter-row", craft_skill_num)}` : `keyword=${escape(textSanitizer($('#keyword-input').val()))}`}`
    let mode_str = `mode=${encode(".mode-row", craft_mode_num)}`
    let attr_str = `attr=${encode(".attr-row", craft_attr_num)}`
    let race_str = `race=${encode(".race-row", craft_race_num)}`
    let star_str = `star=${encode(".star-row", craft_star_num)}`
    let charge_str = `chrg=${encode(".charge-row", craft_charge_num)}`
    let or_str = `or=${or_filter ? `1` : `0`}`
    
    window.history.pushState(null, null, `?${search_str}&${mode_str}&${attr_str}&${race_str}&${star_str}&${charge_str}&${or_str}`);
}

function readUrl()
{
    let code_array = location.search.split("&").map(x => x.split("=")[1]);
    let code_name_array = location.search.split("?")[1].split("&").map(x => x.split("=")[0]);
    
    if(code_array.length != 7)
    {
        errorAlert(1);
        return;
    }
    
    let code_name_1 = ["search", "mode", "attr", "race", "star", "chrg", "or"];
    let code_name_2 = ["keyword", "mode", "attr", "race", "star", "chrg", "or"];
    
    let isCodeNameFit = true;
    $.each(code_name_array, (index, code) => {
        if( code_name_array[index] !== code_name_1[index] && 
            code_name_array[index] !== code_name_2[index] )
        {
            isCodeNameFit = false;
            return false;
        }
    })
    
    if(!isCodeNameFit) {
        errorAlert(1);
        return;
    }
    
    
    if(code_name_array[0] === code_name_1[0])
    {
        let skill_code = decode(code_array[0]);
        setButtonFromUrl(".filter-row", skill_code, clearFilterButtonRow('filter'));
    }
    else
    {
        let skill_keyword = code_array[0];
        setInputFromUrl(".keyword-input", unescape(skill_keyword));
        
        $("#keyword-switch").click();
        keywordSwitch();
    }
    
    let mode_code = decode(code_array[1]);
    setButtonFromUrl(".mode-row", mode_code, clearFilterButtonRow('mode'));
    
    let attr_code = decode(code_array[2]);
    setButtonFromUrl(".attr-row", attr_code, clearFilterButtonRow('attr'));
    
    let race_code = decode(code_array[3]);
    setButtonFromUrl(".race-row", race_code, clearFilterButtonRow('race'));
    
    let star_code = decode(code_array[4]);
    setButtonFromUrl(".star-row", star_code, clearFilterButtonRow('star'));
    
    let chrg_code = decode(code_array[5]);
    setButtonFromUrl(".charge-row", chrg_code, clearFilterButtonRow('charge'));
    
    let and_or_code = code_array[6];
    and_or_code[0] == "0" && andOrChange();
    
    
    startFilter();
    
    window.history.pushState(null, null, location.pathname);    // clear search parameters
}