import { describe, test, expect } from "vitest";
import { searchInData } from "../../src/mainPage/mainPage_logic.js"
 
// Mockdata för testerna //
  const mockData = {
            rooms: [
                { type: "Kök", room_id: 1, name: "Kök"},
                { type: "Badrum", room_id: 2, name: "Badrum"}
            ],
            areas: [],
            problems: [],
            recipes: [],
            blog_posts: [],
            ingredients: [],
            tools: []
            };
 
describe("searchInData", () => {
 
    test("ska returnera tom array om query är tom", () => {
        let results = searchInData(mockData, " ");
        expect(results).toEqual([]);
    });
 
    test("ska hitta rum med matchande namn", () => {
    let results = searchInData(mockData, "Kök");
    expect(results).toEqual([
        { type: "room", title: "Kök", id: 1 }
        ]);
    });
 
});
 