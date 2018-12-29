function deleteUnusedNodes(cfg){
    for(let cfgElement of cfg){
        cfgElement.exception = undefined;
        if(cfgElement.label.startsWith('return')){
            delete cfgElement.normal;
        }
    }
    cfg.splice(0,1);
    cfg[0].parent = undefined; cfg[0].prev = [];
    cfg.splice(cfg.length-1, cfg.length);
    return cfg;
}

function updatePrevNode(cfgElement, nextElement){
    for(let prevElement of cfgElement.prev) {
        if(prevElement.normal === nextElement){
            prevElement.normal = nextElement.normal;
        }
        else if(prevElement.true === nextElement){
            prevElement.true = nextElement.normal;
        }
        else{
            prevElement.false = nextElement.normal;
        }
    }

}

function checkConditionsForMerge(cfg, i){
    return cfg[i].normal.prev.length === 1 && (cfg[i].normal.normal && (cfg[i].parent === cfg[i].normal.parent || !cfg[i].parent)) ? true : false;
}

function mergeNodes(cfg){
    let newCfg = [];
    let minIndex = cfg.length;
    for(let i=0;i<cfg.length; i++){
        if(cfg[i].normal && checkConditionsForMerge(cfg, i)){
            if(i < minIndex){
                minIndex = i;
            }
            cfg[i].normal.label = cfg[i].label + '\n' + cfg[i].normal.label;
            updatePrevNode(cfg[minIndex], cfg[i]);
        }
        else{
            minIndex = cfg.length;
            newCfg.push(cfg[i]);
        }
    }
    return newCfg;
}

export function cleanCFGGraph(cfg){
    deleteUnusedNodes(cfg);
    return mergeNodes(cfg);
}