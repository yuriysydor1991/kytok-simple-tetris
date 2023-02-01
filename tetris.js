/* array of single blocks */
var _blocks = [] ;
var _current_shape = {} ;
var _shapes_creators = [] ;
var _block_colors = [] ;
var _prev_score = 0 ;
var _score = 0 ;
var _level = 1 ;
var _gaming = false ;

var _tick_msecs = 1000 ;
var _block_size = 6 ;

var _tetris_game_width = _block_size * 40 ;
var _tetris_game_height = _block_size * 60 ;

function __tetris_erase_all_blocks ()
{
    $('.tetris_game_area').html ('') ;
    
    _blocks = [] ;
    
    return false ;
}

function __tetris_get_block (count)
{
    var bks = [] ;
    
    var color_index = Math.floor((Math.random()*_block_colors.length)) ;
    
    for (var i=0; i<count; ++i)
    {
        //var block =  document.createElement ("div") ;
        var block =  $('<div></div>') ;
        
        $(block).css ({"width": _block_size + 'px',
                       "height": _block_size + 'px', 
                       "background-color": _block_colors[color_index] ,
                       //"background-color": _block_colors[Math.floor((Math.random()*_block_colors.length))] ,
                       "position": "absolute",
                       "display": "inline-block"}) ;
                       
        block.topDisp = $('.tetris_game_area').offset().top ;
        block.leftDisp = $('.tetris_game_area').offset().left + _tetris_game_width/2 ;
        
        $(block).css ("left", block.leftDisp) ;
        $(block).css ("top", block.topDisp) ;
                    
        $('.tetris_game_area').append (block) ;
        
        bks.push (block) ;
    }
    
    return bks ;
}

function __block_to_bottom (relative, block)
{
    block.topDisp = relative.topDisp + _block_size ;
    block.leftDisp = relative.leftDisp ;
    
    $(block).css ("left", block.leftDisp) ;
    $(block).css ("top", block.topDisp) ;
}

function __block_to_left (relative, block)
{
    block.topDisp = relative.topDisp ;
    block.leftDisp = relative.leftDisp + _block_size ;
    
    $(block).css ("left", block.leftDisp) ;
    $(block).css ("top", block.topDisp) ;
}

function __block_to_right (relative, block)
{
    block.topDisp = relative.topDisp ;
    block.leftDisp = relative.leftDisp - _block_size ;
    
    $(block).css ("left", block.leftDisp) ;
    $(block).css ("top", block.topDisp) ;
}

function __block_to_top (relative, block)
{
    block.topDisp = relative.topDisp - _block_size ;
    block.leftDisp = relative.leftDisp ;
    
    $(block).css ("left", block.leftDisp) ;
    $(block).css ("top", block.topDisp) ;
}

function __tetris_shape_RG () 
{
    var blocks = [] ;
    
    blocks = __tetris_get_block (4) ;
    
    __block_to_right (blocks[0], blocks[1]) ;
    __block_to_bottom (blocks[1], blocks[2]) ;
    __block_to_right (blocks[2], blocks[3]) ;
    
    blocks[1].center = true ;
    
    return blocks ;
}

function __tetris_shape_LG () 
{
    var blocks = [] ;
    
    blocks = __tetris_get_block (4) ;
    
    __block_to_left (blocks[0], blocks[1]) ;
    __block_to_bottom (blocks[1], blocks[2]) ;
    __block_to_left (blocks[2], blocks[3]) ;
    
    blocks[1].center = true ;
    
    return blocks ;
}

function __tetris_shape_square () 
{
    var blocks = [] ;
    
    blocks = __tetris_get_block (4) ;
    
    __block_to_bottom (blocks[0], blocks[1]) ;
    __block_to_right (blocks[0], blocks[2]) ;
    __block_to_bottom (blocks[2], blocks[3]) ;
    
    return blocks ;
}

function __tetris_shape_T ()
{
    var blocks = [] ;
    
    blocks = __tetris_get_block (4) ;
    
    __block_to_bottom (blocks[0], blocks[1]) ;
    __block_to_left (blocks[1], blocks[2]) ;
    __block_to_right (blocks[1], blocks[3]) ;
    
    blocks[1].center = true ;
    
    return blocks ;
}

function __tetris_shape_LR ()
{
    var blocks = [] ;
    
    blocks = __tetris_get_block (4) ;
    
    __block_to_bottom (blocks[0], blocks[1]) ;
    __block_to_bottom (blocks[1], blocks[2]) ;
    __block_to_right  (blocks[2], blocks[3]) ;
    
    blocks[1].center = true ;
    
    return blocks ;
}

function __tetris_shape_LL ()
{
    var blocks = [] ;
    
    blocks = __tetris_get_block (4) ;
    
    __block_to_bottom (blocks[0], blocks[1]) ;
    __block_to_bottom (blocks[1], blocks[2]) ;
    __block_to_left   (blocks[2], blocks[3]) ;
    
    blocks[1].center = true ;
    
    return blocks ;
}

function __tetris_shape_plane ()
{
    var blocks = [] ;
    
    blocks = __tetris_get_block (5) ;
    
    for (var i=0; i<blocks.length; ++i)
    {
        blocks [i].leftDisp += (_block_size * (i+1)) ;
        
        $(blocks[i]).css (
                 "left", blocks[i].leftDisp
             ) ;
    }
    
    blocks[Math.round(blocks.length/2)-1].center = true ;
    
    return blocks ;
}

function __tetris_shapes_init ()
{
    _shapes_creators.push (__tetris_shape_plane) ;
    _shapes_creators.push (__tetris_shape_LL) ;
    _shapes_creators.push (__tetris_shape_LR) ;
    _shapes_creators.push (__tetris_shape_T) ;
    _shapes_creators.push (__tetris_shape_square) ;
    _shapes_creators.push (__tetris_shape_LG) ;
    _shapes_creators.push (__tetris_shape_RG) ;
}

function __tetris_new_shape ()
{
    _current_shape.blocks = [] ;

    if (_shapes_creators.length>0)
    {
        var creator = _shapes_creators [Math.floor((Math.random()*_shapes_creators.length))] ;
        //var creator = _shapes_creators [_shapes_creators.length-1] ;
    
        _current_shape.blocks = creator () ;
    }
    
    return ;
}

function __insert_from_shape_to_blocks ()
{
    for (var bl=0; bl<_current_shape.blocks.length; ++bl)
    {
        _blocks.push (_current_shape.blocks[bl]) ;
    }
}

function __tetris_shape_collizion_left_border_test ()
{
    for (var bl=0; bl<_current_shape.blocks.length; ++ bl)
    {
        if (((_current_shape.blocks[bl].leftDisp) <= ( $('.tetris_game_area').offset().left+1)))
        {
            return true ;
        }
    }
    
    return false ;
}

function __tetris_shape_collizion_right_border_test ()
{
    for (var bl=0; bl<_current_shape.blocks.length; ++ bl)
    {
        if ((_current_shape.blocks[bl].leftDisp + _block_size) >= ($('.tetris_game_area').offset().left + $('.tetris_game_area').width()-1))
        {
            return true ;
        }
    }
    
    return false ;
}

function __tetris_shape_collizion_bottom_border_test ()
{
    for (var bl=0; bl<_current_shape.blocks.length; ++ bl)
    {
        if (($(_current_shape.blocks[bl]).height() + $(_current_shape.blocks[bl]).offset().top) 
             >= ($('.tetris_game_area').height() + $('.tetris_game_area').offset().top - 1))
        {            
            return true ;
        }
    }
    
    return false ;
}

function __tetris_shape_collizion_bottom_blocks_test ()
{
    for (var bl=0; bl<_current_shape.blocks.length; ++ bl)
    {
        for (var abl=0; abl<_blocks.length; ++abl)
        {
            if ((_block_size + _current_shape.blocks[bl].topDisp) == (_blocks[abl].topDisp) &&
                (_current_shape.blocks[bl].leftDisp == _blocks[abl].leftDisp))
            {
                return true ;
            }
        }
    }
    
    return false ;
}

function __tetris_shape_collizion_left_blocks_test ()
{
    for (var bl=0; bl<_current_shape.blocks.length; ++bl)
    {
        //$('.tetris_game_score').html('') ;
        
        for (var abl=0; abl<_blocks.length; ++abl)
        {
            //$('.tetris_game_score').append ('left: curr - ' + _current_shape.blocks[bl].leftDisp + ' ? blocks - ' + (_blocks[abl].leftDisp + _block_size + '<br>')) ;
            //$('.tetris_game_score').append('top : curr - ' + (_current_shape.blocks[bl].topDisp) + ' ? blocks - ' + (_blocks[abl].topDisp) + '<br>') ;
            
            if ((_current_shape.blocks[bl].topDisp) == (_blocks[abl].topDisp) &&
                (_current_shape.blocks[bl].leftDisp == (_blocks[abl].leftDisp + _block_size)))
            {
                //$('.tetris_game_score').append ('true') ;
                return true ;
            }
        }
    }
    
    return false ;
}

function __tetris_shape_collizion_right_blocks_test ()
{
    for (var bl=0; bl<_current_shape.blocks.length; ++bl)
    {
        //$('.tetris_game_score').html('') ;
        
        for (var abl=0; abl<_blocks.length; ++abl)
        {
            //$('.tetris_game_score').append('right: curr - ' + (_current_shape.blocks[bl].leftDisp + _block_size) + ' ? blocks - ' + (_blocks[abl].leftDisp + '<br>')) ;
            //$('.tetris_game_score').append('top : curr - ' + (_current_shape.blocks[bl].topDisp) + ' ? blocks - ' + (_blocks[abl].topDisp) + '<br>') ;
            
            if ((_current_shape.blocks[bl].topDisp) == (_blocks[abl].topDisp) &&
                ((_current_shape.blocks[bl].leftDisp + _block_size) == (_blocks[abl].leftDisp)))
            {
                //$('.tetris_game_score').append ('true') ;
                
                return true ;
            }
        }
    }
    
    return false ;
}

function __tetris_show_score ()
{
    $('.tetris_game_score').html (' Бали : ' + _score) ;
    $('.tetris_game_level').html ('Рівень: ' + _level) ;
    
    return false ;
}

function erase_row_with (y) 
{
    var cnt = 0 ;
    
    for (var iter=0; iter<_blocks.length; ++iter)
    {
        if (_blocks[iter].topDisp==y)
        {
            $(_blocks[iter]).remove () ;
            _blocks.splice (iter, 1) ;
            -- iter ;
            cnt ++ ;
            continue ;
        }
        
        if (_blocks[iter].topDisp<y)
        {
            _blocks[iter].topDisp += _block_size ; 
            
            $(_blocks[iter]).css ("top", _blocks[iter].topDisp) ;
        }
    }
    
    _score += _tetris_game_width/_block_size * (_block_size*_level) ;
    
    if ((_score - _prev_score)>=500 && _level<8)
    {
        _prev_score = _score ;
        
        _tick_msecs -= 100 ; 
        
        _level ++ ;       
    }
    
    __tetris_show_score () ;
    
    return false ;
}

function __tetris_check_lines ()
{
    var checked = [] ;
    
    for (var iter=0; iter<_blocks.length; ++iter)
    {
        if (checked[_blocks[iter].topDisp] == undefined)
        {
            //alert ('checking: ' + _blocks[iter].topDisp) ;
            checked[_blocks[iter].topDisp] = true ;
            
            var cnt = 1 ;
            
            for (var jter=iter+1; jter<_blocks.length; ++jter)
            {
                if (_blocks[jter].topDisp==_blocks[iter].topDisp)
                { ++ cnt ; }
            }
            
            if (cnt>=(_tetris_game_width/_block_size))
            { erase_row_with (_blocks[iter].topDisp) ; }
        }
    }
    
    return false ;
}

function __tetris_move_down_shape ()
{
    if (__tetris_shape_collizion_bottom_blocks_test () ||
        __tetris_shape_collizion_bottom_border_test () )
    {
        __insert_from_shape_to_blocks () ;
        
        __tetris_check_lines () ;
        
        __tetris_new_shape () ;
    }
    else
    {
        for (var bl=0; bl<_current_shape.blocks.length; ++ bl)
        {
            _current_shape.blocks[bl].topDisp += _block_size ;
            
            $(_current_shape.blocks[bl]).css (
             "top", _current_shape.blocks[bl].topDisp
            ) ;
        }
    }
    
    return false ;
}

function __tetris_check_coord (leftDisp, topDisp)
{
    if (leftDisp>=$('.tetris_game_area').offset().left + $('.tetris_game_area').width()-1 ||
        leftDisp<$('.tetris_game_area').offset().left || 
        topDisp>=$('.tetris_game_area').offset().top + $('.tetris_game_area').height())
    { return true ; }
    
    for (var iter=0; iter<_blocks.length; ++iter)
    {
        if (leftDisp==_blocks[iter].leftDisp && 
            topDisp==_blocks[iter].topDisp)
        { return true ; }
    }
    
    return false ;
}

function __tetris_rotate_shape ()
{
    var avgy = -1 ,
        avgx = -1 ;
    
    for (var iter=0; iter<_current_shape.blocks.length; ++iter)
    {
        if (_current_shape.blocks[iter].hasOwnProperty("center"))
        {
            avgx = _current_shape.blocks[iter].leftDisp ;
            avgy = _current_shape.blocks[iter].topDisp ;
        }
    }
    
    if (avgx==(-1))
    { return false ; }
    
    var tydisp = 0 ;
    var txdisp = 0 ;
    
    for (var iter=0; iter<_current_shape.blocks.length; ++iter)
    {
        txdisp = parseFloat(avgx) + parseFloat((avgy - _current_shape.blocks[iter].topDisp)) ;
        tydisp = parseFloat(avgy) + parseFloat((_current_shape.blocks[iter].leftDisp - avgx)) ;
        
        if (__tetris_check_coord (txdisp, tydisp))
        { return false ; }
    }
    
    for (var iter=0; iter<_current_shape.blocks.length; ++iter)
    {                
        txdisp = parseFloat(avgx) + parseFloat((avgy - _current_shape.blocks[iter].topDisp)) ;
        tydisp = parseFloat(avgy) + parseFloat((_current_shape.blocks[iter].leftDisp - avgx)) ;
                   
        _current_shape.blocks[iter].leftDisp = txdisp ;
        _current_shape.blocks[iter].topDisp = tydisp ;                   
        
        $(_current_shape.blocks[iter]).css ("left", _current_shape.blocks[iter].leftDisp) ;
        $(_current_shape.blocks[iter]).css ("top", _current_shape.blocks[iter].topDisp) ;
    }
    
    return false ;
}

function __tetris_keypress_handler (event)
{
    if (event.charCode==100 &&
        !__tetris_shape_collizion_right_blocks_test () &&
        !__tetris_shape_collizion_right_border_test ()) //a
    {
        for (var x=0; x<_current_shape.blocks.length; ++x)
        {
            _current_shape.blocks[x].leftDisp += _block_size ;
            
            $(_current_shape.blocks[x]).css (
                 "left", _current_shape.blocks[x].leftDisp
             ) ;
        }
        
        return false ;
    }
    
    if (event.charCode==97 && 
        !__tetris_shape_collizion_left_blocks_test () &&
        !__tetris_shape_collizion_left_border_test ()) //d
    {
        for (var x=0; x<_current_shape.blocks.length; ++x)
        {
            _current_shape.blocks[x].leftDisp -= _block_size ;
            
            $(_current_shape.blocks[x]).css (
                 "left", _current_shape.blocks[x].leftDisp
             ) ;
        }
        
        return false ;
    }
    
    if (event.charCode==115) //s
    {
        __tetris_move_down_shape () ;
        
        return false ;
    }
    
    if (event.charCode==119) //w
    {
        __tetris_rotate_shape () ;
        
        return false ;
    }
    
    return false ;
}

function __tetris_physics ()
{
    __tetris_move_down_shape () ;
    
    setTimeout (__tetris_physics, _tick_msecs) ;
    
    return false ;
}

function __tetris_init_blocks (top_block)
{
    $(document).on ("keypress", __tetris_keypress_handler) ;
    
    $(top_block).html ("<div class='tetris_game_area'></div>") ;
    $(top_block).append ("<div class='tetris_stat'><div class='tetris_game_score'></div><div class='tetris_game_level'></div>" + 
                         "<div class='tetris_description'>'a', 'd' - вліво/вправо<br>'s' - вниз<br>'w' - поворот фігури</div></div>") ;
    
    $('.tetris_game_area').css ({ "width": _tetris_game_width,
                                  "height": _tetris_game_height,
                                  "margin": 0,
                                  "padding": 0}) ;
    
    return false ;
}

function tetris_init_game (event)
{
    _gaming = true ;
    $('.tetris_game_area').off ('click', tetris_init_game) ;
    
    __tetris_erase_all_blocks () ;
    
    $('.tetris_game_area').html ('') ;
    
    __tetris_shapes_init () ; 
    __tetris_new_shape () ;
    
    __tetris_physics () ;
    
    __tetris_show_score () ;
    
    return false ;
}

function __init_random_color_change ()
{
    if (_gaming)
    { return false ; }
    
    for (var iter=0; iter<Math.floor(_blocks.length/3) && !_gaming; ++iter)
    {
        var rindex = Math.floor(Math.random() * _blocks.length) ;

        $(_blocks[rindex]).css ({
                                 "background-color": _block_colors[Math.floor((Math.random()*_block_colors.length))] ,
                                 }) ;
                                 
    }
    
    if (!_gaming)
    { setTimeout (__init_random_color_change, 1000) ; }
    
    return false ;
}

function __init_animate_background ()
{
    __tetris_erase_all_blocks () ;
    
    var ablocks = '' ;
    
    for (var iter=0; iter<_tetris_game_width; iter+=_block_size)
    {
        for (var jter=0; jter<_tetris_game_height; jter+=_block_size)
        {
            var block =  document.createElement ("div") ;
        
            $(block).css ({"width": _block_size + 'px',
                           "height": _block_size + 'px', 
                           "background-color": _block_colors[Math.floor((Math.random()*_block_colors.length))] ,
                           "position": "absolute",
                           "display": "inline-block"}) ;
            
            block.topDisp = $('.tetris_game_area').offset().top + jter - _block_size + 1;
            block.leftDisp = $('.tetris_game_area').offset().left + iter ;
            
            $(block).css ("left", block.leftDisp) ;
            $(block).css ("top", block.topDisp) ;
            
            _blocks.push (block) ;
        }
    }
    
    $('.tetris_game_area').append (_blocks) ;
    
    $('.tetris_game_area').append ("<div class='tetris_motivate_message'>Натисни,<br>щоб розпочати гру!</div>") ;
    
    var avgy = $('.tetris_game_area').offset().top + ($('.tetris_game_area').height()/2) ;
    var avgx = $('.tetris_game_area').offset().left + ($('.tetris_game_area').width()/2) ;
    
    $('.tetris_motivate_message').css ({
            "position":"absolute",
            "text-align": "center",
            "display": "inline-block",
            "padding": "5px",
            "font-family": "URW Gothic L",
            "background-color": "#91cda3" }) ;

    $('.tetris_motivate_message').css ({
            "top": avgy - ($('.tetris_motivate_message').height()/2),
            "left": avgx - ( $('.tetris_motivate_message').width()/2) }) ;
    
    setTimeout (__init_random_color_change, 1000) ;
    
    return false ;
}

function tetris_init (event)
{
    /* initing block colours */
    _block_colors.push ('#00FF00') ;
    _block_colors.push ('#5555FF') ;
    _block_colors.push ('#7fafff') ;
    _block_colors.push ('#dc7fff') ;
    _block_colors.push ('#ffc333') ;
    _block_colors.push ('#ff5353') ;
    
    __tetris_init_blocks (event.data)
    
    __init_animate_background () ;
    
    $('.tetris_game_area').off ('click', tetris_init_game) ;
    $('.tetris_game_area').on ('click', tetris_init_game) ;
    
    return false ;
}
