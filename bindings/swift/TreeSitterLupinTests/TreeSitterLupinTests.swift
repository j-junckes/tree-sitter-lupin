import XCTest
import SwiftTreeSitter
import TreeSitterLupin

final class TreeSitterLupinTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_lupin())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Lupin grammar")
    }
}
