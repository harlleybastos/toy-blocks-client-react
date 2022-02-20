import { ShapeBlockData } from "../../types/Blocks";
import reducer, { checkBlockStatus } from "./blocks";
import initialState from "./initialState";

jest.mock("cross-fetch");

const mockedFech = jest.fn();

describe("Reducers::Blocks", () => {
  const getInitialState = () => {
    return initialState();
  };

  const blockA: ShapeBlockData = {
    id: "0",
    type: "blocks",
    attributes: {
      index: 0,
      timestamp: 0,
      data: "data 0",
      hash: "hash 0",
      "previous-hash": "null",
    },
  };
  const blockB: ShapeBlockData = {
    id: "1",
    type: "",
    attributes: {
      index: 0,
      timestamp: 0,
      data: "",
      hash: "",
      "previous-hash": "0",
    },
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(getInitialState());
  });

  it("should check checkBlockStatus.pending", () => {
    const appState = [
      {
        data: [],
      },
    ];
    const action = { type: checkBlockStatus.pending, payload: [] };
    const expected = [
      {
        data: [],
      },
      {
        data: [],
        isLoading: true,
        isError: false,
      },
    ];

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should check checkBlockStatus.fulfilled", () => {
    const appState = [
      {
        data: [blockA],
      },
    ];

    const action = {
      type: checkBlockStatus.fulfilled,
      payload: { blockB },
    };

    const expected = [
      {
        data: [blockA],
      },
      {
        blockB,
      },
    ];

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle checkBlockStatus.reject", () => {
    const appState = [
      {
        data: [],
      },
    ];
    const action = { type: checkBlockStatus.rejected, payload: [] };
    const expected = [
      {
        data: [],
      },
      {
        data: [],
        isLoading: false,
        isError: true,
      },
    ];

    expect(reducer(appState, action)).toEqual(expected);
  });
});

describe("Action::Blocks", () => {
  const dispatch = jest.fn();

  afterEach(() => {
    dispatch.mockClear();
    mockedFech.mockClear();
  });

  const node = {
    url: "https://thawing-springs-53971.herokuapp.com",
    online: false,
    name: "Node A",
    loading: false,
  };
  const nodeForReject = {
    url: "http://localhost:3002",
    online: false,
    name: "Node B",
    loading: false,
  };

  it("should fetch the block status", async () => {
    mockedFech.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve({ node_name: "Secret Lowlands" });
        },
      })
    );
    await checkBlockStatus(node)(dispatch, () => {}, {});

    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: checkBlockStatus.pending.type,
        meta: expect.objectContaining({ arg: node }),
      }),
      expect.objectContaining({
        type: checkBlockStatus.fulfilled.type,
        meta: expect.objectContaining({ arg: node }),
        payload: expect.objectContaining([]),
      }),
    ]);

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("sould fail to fetch the block status", async () => {
    await checkBlockStatus(nodeForReject)(dispatch, () => {}, {});
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: checkBlockStatus.pending.type,
        meta: expect.objectContaining({ arg: nodeForReject }),
      }),
      expect.objectContaining({
        type: checkBlockStatus.rejected.type,
        meta: expect.objectContaining({ requestStatus: "rejected" }),
      }),
    ]);


    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });
});
