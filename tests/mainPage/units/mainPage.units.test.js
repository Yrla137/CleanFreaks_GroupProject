import { describe, test, expect } from "vitest";
import { searchInData } from "../../src/mainPage_logic.js";

  const mockData = {
            rooms: [
                { name: "Kök", room_id: 1 },
                { name: "Badrum", room_id: 2 }
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
        { type: "rooms", data: { name: "Kök", room_id: 1 } }
        ]);
    });

});