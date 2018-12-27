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

function updatePrevNode(cfgElement){
    for(let prevElement of cfgElement.prev) {
        if(prevElement.normal){
            prevElement.normal = cfgElement.normal;
        }
        else if(prevElement.true === cfgElement){
            prevElement.true = cfgElement.normal;
        }
        else if(prevElement.false === cfgElement){
            prevElement.false = cfgElement.normal;
        }
    }
}

function mergeNodes(cfg){
    let newCfg = [];
    for(let i=0;i<cfg.length; i++){
        if(cfg[i].normal && cfg[i].normal.prev.length === 1 && cfg[i].normal.normal){
            cfg[i].normal.label = cfg[i].label + '\n' + cfg[i].normal.label;
            updatePrevNode(cfg[i]);
        }
        else{
            newCfg.push(cfg[i]);
        }
    }
    return newCfg;
}

export function cleanCFGGraph(cfg){
    deleteUnusedNodes(cfg);
    return mergeNodes(cfg);
}