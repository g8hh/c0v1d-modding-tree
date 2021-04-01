var layoutInfo = {
    startTab: "none",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree



addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]]
})