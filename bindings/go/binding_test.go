package tree_sitter_lupin_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_lupin "github.com/j-junckes/tree-sitter-lupin/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_lupin.Language())
	if language == nil {
		t.Errorf("Error loading Lupin grammar")
	}
}
