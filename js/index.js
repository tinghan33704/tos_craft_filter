var skill_type_string = [
["符石轉水", "符石轉火", "符石轉木", "符石轉光", "符石轉暗", "符石轉心", "符石強化"],
["直行轉水", "直行轉火", "直行轉木", "直行轉光", "直行轉暗", "直行轉心"],
["水屬追打", "火屬追打", "木屬追打", "光屬追打", "暗屬追打", "無屬追打"],
["減傷", "意志", "迴避", "回血", "我方傷害吸收"],
["直傷", "全體直傷", "單體破防直傷"],
["增傷", "增回", "破防", "反擊"],
["對水增傷", "對火增傷", "對木增傷", "對光增傷", "對暗增傷"],
["延遲", "減CD", "單體轉全體", "無視屬性相剋"],
["無視拼圖盾", "無視五屬盾", "無視攻前盾"]
];

var mode_type_string = ["連鎖龍紋", "轉動龍印", "破碎龍咒", "映照龍符", "疾速龍玉", "裂空龍刃", "落影龍璃", "擴散龍結", "鏡像龍丸", "節奏龍弦"];

var attr_type_string = ["沒有限制", "水", "火", "木", "光", "暗"];

var race_type_string = ["沒有限制", "人類", "獸類", "妖精類", "龍類", "神族", "魔族", "機械族"];

var star_type_string = ["1", "2", "3"];

var charge_type_string = ["消除水符石", "消除火符石", "消除木符石", "消除光符石", "消除暗符石", "消除心符石", "消除符石", "發動攻擊", "受到攻擊", "4 Combo以上"]


var filter_set = new Set();
var blue_str = "rgb(100, 100, 255)";
var green_str = "rgb(50, 155, 50)";
var white_str = "rgb(255, 255, 255)";
var black_str = "rgb(0, 0, 0)";
var or_filter = true;
var keyword_search = false;
var input_maxlength = 50;
var theme = 'normal';

const skill_num = skill_type_string.length;
const mode_num = mode_type_string.length;
const attr_num = attr_type_string.length;
const race_num = race_type_string.length;
const star_num = star_type_string.length;
const charge_num = charge_type_string.length;

const encode_chart = [
    "0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j",
    "k","l","m","n","o","p","q","r","s","t",
    "u","v","w","x","y","z","A","B","C","D",
    "E","F","G","H","I","J","K","L","M","N",
    "O","P","Q","R","S","T","U","V","W","X",
    "Y","Z","+","-"
];

const attr_zh_to_en = {"水": "w", "火": "f", "木": "e", "光": "l", "暗": "d"};

$(document).ready(function(){
    init();
    $("#start_filter").on("click", startFilter);
    $("#and_or_filter").on("click", andOrChange);
    $("#reset_skill").on("click", resetSkill);
    $("#reset_all").on("click", resetAll);
    $("#reset_mode").on("click", resetMode);
    $("#reset_attr").on("click", resetAttr);
    $("#reset_race").on("click", resetRace);
    $("#reset_star").on("click", resetStar);
    $("#reset_charge").on("click", resetCharge);
    $("#reset_keyword").on("click", resetKeyword);
    $("#keyword-switch").on("click", keywordSwitch);
    
    if(location.search) readUrl();
});

$(window).resize(function(){
    if(window.matchMedia("(min-width: 768px)").matches)
    {
        $(".navbar-btn").css({"margin-top": ($(".navrow").height()-$(".navbar-btn").height())/2});
    }
    else
    {
        $(".navbar-btn").css({"margin-top": 0});
    }
});

function init()
{
    $(".row.result-row").hide();
    
    $('#toTop-btn').click(function()
    { 
        $('html,body').animate({scrollTop:0}, 300);
    });
    $(window).scroll(function()
    {
        if ($(this).scrollTop() > 300) $('#toTop-btn').fadeIn(200);
        else $('#toTop-btn').stop().fadeOut(200);
    }).scroll();
    
    
    $('#changeTheme-btn').click(function()
    { 
        changeTheme();
    });
    
    var i = 0;
    $(".filter-row").html(function()
    {
        var str = $(".filter-row").html();
        for(var x of skill_type_string)
        {
            str += "<div class='col-12 my-2'></div>";
            for(var s of x)
            {   
                str += "<div class='col-6 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='filter-"+i+"'><label class='p-1 w-100 text-center filter-btn' for='filter-"+i+"'>"+s+"</label></div>";
                i ++;
            }
        }
        return str;
    });
    
    $(".keyword-row").html(function()
    {
        var str = $(".keyword-row").html();
        str += "<div class='col-12 my-2'></div>";
        str += "<div class='col-12 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='keyword-switch'><label class='p-1 w-100 text-center keyword-btn' for='keyword-switch'>關鍵字搜尋</label></div>";
        str += "<div class='col-12 col-md-8 col-lg-10 btn-shell'><input type='text' class='form-control keyword-input' id='keyword-input' placeholder='輸入技能關鍵字' maxlength="+input_maxlength+" disabled></div>";
        return str;
    });
    
    $(".mode-row").html(function()
    {
        var str = $(".mode-row").html();
        str += "<div class='col-12 my-2'></div>";
        for(var x of mode_type_string)
        {
            str += "<div class='col-6 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='filter-"+i+"'><label class='p-1 w-100 text-center mode-btn' for='filter-"+i+"'>"+x+"</label></div>";
            i ++;
        }
        return str;
    });
    
    $(".attr-row").html(function()
    {
        var str = $(".attr-row").html();
        str += "<div class='col-12 my-2'></div>";
        for(var x of attr_type_string)
        {
            str += "<div class='col-6 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='filter-"+i+"'><label class='p-1 w-100 text-center attr-btn' for='filter-"+i+"'>"+x+"</label></div>";
            i ++;
        }
        return str;
    });
    
    $(".race-row").html(function()
    {
        var str = $(".race-row").html();
        str += "<div class='col-12 my-2'></div>";
        for(var x of race_type_string)
        {
            str += "<div class='col-6 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='filter-"+i+"'><label class='p-1 w-100 text-center race-btn' for='filter-"+i+"'>"+x+"</label></div>";
            i ++;
        }
        return str;
    });
    
    $(".star-row").html(function()
    {
        var str = $(".star-row").html();
        str += "<div class='col-12 my-2'></div>";
        for(var x of star_type_string)
        {
            str += "<div class='col-6 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='filter-"+i+"'><label class='p-1 w-100 text-center star-btn' for='filter-"+i+"'>"+x+" ★</label></div>";
            i ++;
        }
        return str;
    });
    
    $(".charge-row").html(function()
    {
        var str = $(".charge-row").html();
        str += "<div class='col-12 my-2'></div>";
        for(var x of charge_type_string)
        {
            str += "<div class='col-6 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='filter-"+i+"'><label class='p-1 w-100 text-center charge-btn' for='filter-"+i+"'>"+x+"</label></div>";
            i ++;
        }
        return str;
    });
    
    or_filter = true;
    keyword_search = false;
}

function keywordSwitch()
{
    if($("#keyword-switch").prop('checked'))
    {
        $('#keyword-input').attr('disabled', false);
        $('#keyword-input').css('border', '1px solid var(--text_color)');
        $('#keyword-input').css('background-color', 'var(--button_keyword_color_input_able)');
        keyword_search = true;
        
        $(".filter-row .filter").each(function(){
            $(this).attr('disabled', true);
            $(this).next().css({
                'border': '1px solid var(--button_keyword_color_unable)', 
                'color': '#AAAAAA', 
                'background-color': 'var(--button_keyword_color_unable)', 
                'cursor': 'default', 
                'font-weight': 'normal'
            });
        });
    }
    else
    {
        $('#keyword-input').attr('disabled', true);
        $('#keyword-input').css('border', '1px solid var(--button_keyword_color_input_unable)');
        $('#keyword-input').css('background-color', 'var(--button_keyword_color_input_unable)');
        keyword_search = false;
        
        $(".filter-row .filter").each(function(){
            $(this).attr('disabled', false);
            $(this).next().removeAttr('style');
        });
    }
}

function startFilter()
{
    changeUrl();
    
    if(keyword_search == false)
    {
        filter_set.clear();
    
        var filter_charge_set = new Set();
    
        var skill_set = new Set();
        var skill_select = false;
        
        skill_set.clear();
        
        $(".filter-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                skill_set.add($(this).next("label").text());
                skill_select = true;
            }
        });
        if(keyword_search == false && skill_select == false)
        {
            errorAlert(2);
            return ;
        }
        
        var mode_set = new Set();
        var mode_intersect = false;
        
        $(".mode-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                mode_set.add($(this).next("label").text());
                mode_intersect = true;
            }
        });
        
        var attr_set = new Set();
        var attr_intersect = false;
        
        $(".attr-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                attr_set.add($(this).next("label").text());
                attr_intersect = true;
            }
        });
        
        var race_set = new Set();
        var race_intersect = false;
        
        $(".race-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                race_set.add($(this).next("label").text());
                race_intersect = true;
            }
        });
        
        var star_set = new Set();
        var star_intersect = false;
        
        $(".star-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                star_set.add(parseInt($(this).next("label").text()[0]));
                star_intersect = true;
            }
        });
        
        var charge_set = new Set();
        var charge_intersect = false;
        
        $(".charge-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                charge_set.add($(this).next("label").text());
                charge_intersect = true;
            }
        });
        
        for(var x of craft_data)
        {
            if(mode_intersect)
            {
                if(!(mode_set.has(x.mode))) continue;
            }
            if(attr_intersect)
            {
                if(!(attr_set.has(x.attribute))) continue;
            }
            if(race_intersect)
            {
                if(!race_set.has(x.race)) continue;
            }
            if(star_intersect)
            {
                if(!star_set.has(x.star)) continue;
            }
            if(charge_intersect)
            {
                if(!charge_set.has(x.charge)) continue;
            }
            
            if(or_filter)
            {
                var check = false;
                for(var k of skill_set)
                {
                    if(x.tag.includes(k))
                    {
                        check = true;
                        break;
                    }
                }
                
                if(!check) continue;
            }
            else
            {
                var check = true;
                for(var k of skill_set)
                {
                    if(!x.tag.includes(k))
                    {
                        check = false;
                        break;
                    }
                }
                
                if(!check) continue;
            }
            
            if(x.tag.length > 0) filter_set.add(x.id);
        }
    }
    else
    {
        filter_set.clear();
    
        var filter_charge_set = new Set();
    
    
        /* keyword input check */
        var keyword = textSanitizer($('#keyword-input').val());
        if(keyword.length <= 0)
        {
            errorAlert(3);
            return;
        }
        else if(keyword.length > input_maxlength)
        {
            errorAlert(4);
            return;
        }
        
        /* keyword input split */
        var keyword_set = new Set();
        var keyword_select = false;
        
        keyword_set.clear();
        
        var keywords = keyword.split(',');
        keywords.forEach(function(element){
            if(element.length > 0 && element.length <= 50) keyword_set.add(element);
        });
        
        if(keyword_set.size <= 0)
        {
            errorAlert(3);
            return;
        }
        
        var mode_set = new Set();
        var mode_intersect = false;
        
        $(".mode-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                mode_set.add($(this).next("label").text());
                mode_intersect = true;
            }
        });
        
        var attr_set = new Set();
        var attr_intersect = false;
        
        $(".attr-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                attr_set.add($(this).next("label").text());
                attr_intersect = true;
            }
        });
        
        var race_set = new Set();
        var race_intersect = false;
        
        $(".race-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                race_set.add($(this).next("label").text());
                race_intersect = true;
            }
        });
        
        var star_set = new Set();
        var star_intersect = false;
        
        $(".star-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                star_set.add(parseInt($(this).next("label").text()[0]));
                star_intersect = true;
            }
        });
        
        var charge_set = new Set();
        var charge_intersect = false;
        
        $(".charge-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                charge_set.add($(this).next("label").text());
                charge_intersect = true;
            }
        });
        
        for(var x of craft_data)
        {
            if(mode_intersect)
            {
                if(!(mode_set.has(x.mode))) continue;
            }
            if(attr_intersect)
            {
                if(!(attr_set.has(x.attribute))) continue;
            }
            if(race_intersect)
            {
                if(!race_set.has(x.race)) continue;
            }
            if(star_intersect)
            {
                if(!star_set.has(x.star)) continue;
            }
            if(charge_intersect)
            {
                if(!charge_set.has(x.charge)) continue;
            }
            
            if(or_filter)
            {
                if(x.description.length <= 0) continue;
                
                var check = false;
                var skill_desc = x.description.map(function(e){
                    return textSanitizer(e);
                });
                for(var k of keyword_set)
                {
                    for(var s of skill_desc)
                    {
                        if(s.includes(k))
                        {
                            check = true;
                            filter_set.add(x.id);
                            break;
                        }
                    }
                    if(check) break;
                }
            }
            else
            {
                if(x.description.length <= 0) continue;
                
                var check = true;
                var skill_desc = x.description.map(function(e){
                    return textSanitizer(e);
                }); 
                for(var k of keyword_set)
                {
                    var isKeywordInDesc = false;
                    for(var s of skill_desc)
                    {
                        if(s.includes(k))
                        {
                            isKeywordInDesc = true;
                            break;
                        }
                    }
                    if(isKeywordInDesc) continue;
                    else
                    {
                        check = false;
                        break;
                    }
                }
                
                if(check) filter_set.add(x.id);
            }
            
            
        }
    }
    
    
    $(".row.result-row").show();
    
    var craft_array = Array.from(filter_set);
    $("#result-row").html(function()
    {
        var str = "";
        if(craft_array.length != 0)
        {
            craft_array.sort((a, b) => a - b);
            craft_array.forEach(function(x) {
            
                var sk_str = "";
                var skill_cnt = 0;
                
                var skill = craft_data.find(function(element){
                    return element.id == x;
                }).description;
                
                for(var s of skill)
                {
                    if(skill_cnt > 0) sk_str += "<hr style='margin: 5px 0;'>";
                
                    skill_cnt ++;
                    sk_str += "<div class='skill_tooltip skill_description'><img src='../tos_tool_data/img/craft/skill_"+skill_cnt+".png' />&nbsp;"+s+"</div>";
                }
                
                
                str += "<div class=\"col-3 col-md-2 col-lg-1  result\" data-toggle=\"tooltip\" data-html=\"true\" title=\""+sk_str+"\"><a href=\"http://tosapp.mofang.com.tw/rk-"+x+".html\" target=\"_blank\"><img class=\"monster_img\" src=\"../tos_tool_data/img/craft/"+x+".png\" title=\""+x+"\" onerror=\"this.src='../tos_tool_data/img/craft/noname.png'\"></img></a><div class=\"monsterId\">"+paddingZeros(x, 3)+"</div></div>";
            });
        }
        else
        {
            str = "<div class='col-12' style=\"padding-top: 20px; text-align: center; color: #888888;\"><h1>查無結果</h1></div>";
        }
        return str;
    });
    
    $('.result').tooltip({ boundary: 'scrollParent', placement: 'auto', container: 'body'});
    
    $(".search_tag").html(function(){
        var tag_html = "";
        
        if(!keyword_search)
        {
            skill_set.forEach(function(element){
                tag_html += '<div class="tag_wrapper"><div class="skill_tag" title="'+element+'">'+element+'</div></div>';
            });
        }
        mode_set.forEach(function(element){
            tag_html += '<div class="tag_wrapper"><div class="genre_tag" title="'+element+'">'+element+'</div></div>';
        });
        attr_set.forEach(function(element){
            tag_html += '<div class="tag_wrapper"><div class="genre_tag" title="'+element+'">'+element+'</div></div>';
        });
        race_set.forEach(function(element){
            tag_html += '<div class="tag_wrapper"><div class="genre_tag" title="'+element+'">'+element+'</div></div>';
        });
        star_set.forEach(function(element){
            tag_html += '<div class="tag_wrapper"><div class="genre_tag" title="'+element+' ★">'+element+" ★"+'</div></div>';
        });
        charge_set.forEach(function(element){
            tag_html += '<div class="tag_wrapper"><div class="genre_tag" title="'+element+'">'+element+'</div></div>';
        });
        return tag_html;
    });
    
    jumpTo("result_title");
}

function paddingZeros(x, num)
{
    if(x.toString().length < num)
    {
        return "0".repeat(num-x.toString().length)+x.toString();
    }
    else
    {
        return x.toString();
    }
}

function andOrChange()
{
    or_filter = !or_filter;
    if(or_filter == false)
    {
        $("#and_or_filter").removeClass("btn-warning").addClass("btn-danger").text("AND 搜尋");
    }
    else
    {
        $("#and_or_filter").removeClass("btn-danger").addClass("btn-warning").text("OR 搜尋");
    }
}

function resetSkill()
{
    $(".filter-row .filter").prop('checked', false);
    filter_set.clear();
}

function resetMode()
{
    $(".mode-row .filter").prop('checked', false);
    filter_set.clear();
}

function resetAttr()
{
    $(".attr-row .filter").prop('checked', false);
    filter_set.clear();
}

function resetRace()
{
    $(".race-row .filter").prop('checked', false);
    filter_set.clear();
}

function resetStar()
{
    $(".star-row .filter").prop('checked', false);
    filter_set.clear();
}

function resetCharge()
{
    $(".charge-row .filter").prop('checked', false);
    filter_set.clear();
}

function resetKeyword()
{
    $("#keyword-input").val('');
}

function resetAll()
{
    resetSkill();
    resetMode();
    resetAttr();
    resetRace();
    resetStar();
    resetCharge();
    resetKeyword();
}

function changeUrl()
{
    var str = "";
    
    if(!keyword_search) str += "search=" + encode(".filter-row", skill_num);
    else str += "keyword=" + escape(textSanitizer($('#keyword-input').val()));
    str += "&mode=" + encode(".mode-row", mode_num);
    str += "&attr=" + encode(".attr-row", attr_num);
    str += "&race=" + encode(".race-row", race_num);
    str += "&star=" + encode(".star-row", star_num);
    str += "&chrg=" + encode(".charge-row", charge_num);
    str += "&or=" + (or_filter?"1":"0");
    
    window.history.pushState(null, null, "?"+str);
}

function readUrl()
{
    var code_array = location.search.split("&").map(x => x.split("=")[1]);
    var code_name_array = location.search.split("?")[1].split("&").map(x => x.split("=")[0]);
    
    if(code_array.length != 7)
    {
        errorAlert(1);
        return;
    }
    var code_name_1 = ["search", "mode", "attr", "race", "star", "chrg", "or"];
    var code_name_2 = ["keyword", "mode", "attr", "race", "star", "chrg", "or"];
    
    for(var i in code_name_array)
    {
        if(code_name_array[i] !== code_name_1[i] && code_name_array[i] !== code_name_2[i])
        {
            errorAlert(1);
            return;
        }
    }
    
    if(code_name_array[0] == code_name_1[0])
    {
        var skill_code = decode(code_array[0]);
        setButtonFromUrl(".filter-row", skill_code, resetSkill);
    }
    else
    {
        var skill_keyword = code_array[0];
        setInputFromUrl(".keyword-input", unescape(skill_keyword));
        $("#keyword-switch").click();
        keywordSwitch();
    }
    
    var mode_code = decode(code_array[1]);
    setButtonFromUrl(".mode-row", mode_code, resetMode);
    
    var attr_code = decode(code_array[2]);
    setButtonFromUrl(".attr-row", attr_code, resetAttr);
    
    var race_code = decode(code_array[3]);
    setButtonFromUrl(".race-row", race_code, resetRace);
    
    var star_code = decode(code_array[4]);
    setButtonFromUrl(".star-row", star_code, resetStar);
    
    var chrg_code = decode(code_array[5]);
    setButtonFromUrl(".charge-row", chrg_code, resetCharge);
    
    var and_or_code = code_array[6];
    if(and_or_code[0] == "0") andOrChange();
    
    startFilter();
    
    window.history.pushState(null, null, location.pathname);    // clear search parameters
}

function encode(type, max_num)
{
    var cnt = 1, enc_bin = 0;
    var str = "";
    
    $(type+' .filter').each(function(){
        enc_bin = enc_bin * 2 + ($(this).prop('checked')?1:0);
        if(cnt % 6 == 0)
        {
            str += encode_chart[enc_bin];
            enc_bin = 0;
        }
        cnt ++;
    });
    
    while(cnt % 6 != 1)     // padding for zeros
    {
        enc_bin = enc_bin * 2;
        if(cnt % 6 == 0)
        {
            str += encode_chart[enc_bin];
            enc_bin = 0;
        }
        cnt ++;
    }

    return str;
}

function decode(data)
{
    var bin_str = "";
    for(let c of data)
    {
        for(let i in encode_chart)
        {
            if(c == encode_chart[i])
            {
                var bin_str_part = "";
                for(let k=0; k<6; k++)
                {
                    bin_str_part += (i % 2).toString();
                    i = Math.trunc(i / 2);
                }
                bin_str += bin_str_part.split('').reverse().join('');
            }
        }
    }

    return bin_str;
}

function setButtonFromUrl(type, data, callback)
{
    callback();
    
    var cnt = 0;
    $(type+' .filter').each(function(){
        if(data[cnt] == '1') $(this).click();
        cnt ++;
    });
}

function setInputFromUrl(element, data)
{
    $(element).val(data);
}

function getPosition(element)
{
    var e = document.getElementById(element);
    var left = 0;
    var top = 0;
    var top_padding_offset = 90;

    do
    {
        left += e.offsetLeft;
        top += e.offsetTop;
    }while(e = e.offsetParent);

    return [0, top-top_padding_offset];
}

function jumpTo(id)
{
    window.scrollTo(getPosition(id)[0], getPosition(id)[1]);
}

function changeTheme()
{
    var theme_string = [
        '--background_color', 
        '--text_color', 
        '--text_color_anti', 
        '--button_color', 
        '--button_text_color_checked', 
        '--button_filter_color_checked', 
        '--button_keyword_color_checked', 
        '--button_keyword_color_unable', 
        '--button_keyword_color_input_able', 
        '--button_keyword_color_input_unable', 
        '--button_other_color_checked', 
        '--button_sortby', 
        '--button_primary',
        '--button_warning',
        '--button_danger',
        '--button_success',
        '--text_tag_color', 
        '--monsterid_color', 
        '--text_monsterid_color', 
        '--tooltip_color', 
        '--text_tooltip_color', 
        '--text_name_tooltip_color', 
        '--text_refine_tooltip_color', 
        '--text_recall_tooltip_color', 
        '--text_charge_tooltip_color',
    ];
    
    theme = (theme == 'normal')?'dark':'normal';
    
    theme_string.forEach(x => {
        document.documentElement.style.setProperty(x, 'var('+x+'_'+theme+')');
    });
    
}

function errorAlert(index)
{
    switch(index) {
        case 1:
            alert("[Error Code 01] 請檢查網址是否正確");
        break;
        case 2:
            alert("[Error Code "+paddingZeros(index, 2)+"] 請先選擇功能或輸入技能關鍵字");
        break;
        case 3:
            alert("[Error Code "+paddingZeros(index, 2)+"] 請輸入技能關鍵字");
        break;
        case 4:
            alert("[Error Code "+paddingZeros(index, 2)+"] 技能關鍵字數量不得超過 "+input_maxlength);
        break;
        default:
            
    }
}

function textSanitizer(text)
{
    return text.replace(/<br>/g,'').replace(/\s/g,'').toLowerCase();
}