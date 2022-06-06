import BackendFetch from "../../util/BackendFetch";
import '@testing-library/jest-dom'

// test('handles server error', async () => {
//   server.use(
//     rest.get('/greeting', (req, res, ctx) => {
//       return res(ctx.status(500))
//     }),
//   )

//   render(<Fetch url="/greeting" />)

//   fireEvent.click(screen.getByText('Load Greeting'))

//   await waitFor(() => screen.getByRole('alert'))

//   expect(screen.getByRole('alert')).toHaveTextContent('Oops, failed to fetch!')
//   expect(screen.getByRole('button')).not.toBeDisabled()
// })

// Testing Create Session //
test("backend invalid login 1", async () => {
    const result = await BackendFetch.createSession("admin", "adminpw");
    expect(result["err"]).toBe("wrong input");
});

test("backend invalid login 2", async () => {
    const result = await BackendFetch.createSession("admin'1=1", "adminpw\"1=1");
    expect(result["err"]).toBe("wrong input");
});

test("backend invalid login 3", async () => {
    const result = await BackendFetch.createSession("admin'1=1", "adminpw\"1=1");
    expect(result["err"]).toBe("wrong input");
});

test("backend valid login via name 1", async () => {
    const result = await BackendFetch.createSession("logintest", "logintestpw");
    expect(result["err"]).toBe(false);
    expect(result["result"]).not.toBe(false);
    expect(result["result"]).not.toBe(true);
});

test("backend valid login via email 1", async () => {
    const result = await BackendFetch.createSession("loginEMAILtest@example.com", "loginEMAILtestpw");
    expect(result["err"]).toBe(false);
    expect(result["result"]).not.toBe(false);
    expect(result["result"]).not.toBe(true);
});

// Testing Validate Session //
test("backend valid validate Session 1", async () => {
    const result = await BackendFetch.validateSession("PLACEHOLDER_SESSION_KEY");
    expect(result["err"]).toBe(false);
    expect(result["result"]).toBe(true);
});

test("backend invalid validate Session 1", async () => {
    const result = await BackendFetch.validateSession("somethev-34ving");
    expect(result["err"]).toBe("wrong input");
});

// Testing get spotify Key //
test("backend valid get spotify Key 1", async () => {
    const result = await BackendFetch.getSpotifyKey("PLACEHOLDER_SESSION_KEY");
    expect(result["err"]).toBe(false);
    expect(result["result"]).toBe("PLACEHOLDER_SPOTIFY_KEY");
});

test("backend invalid get spotify Key 1", async () => {
    const result = await BackendFetch.getSpotifyKey("something");
    expect(result["err"]).toBe("wrong input");
});

// Testing register User //
test("backend invalid register 1", async () => {
    const result = await BackendFetch.registerUser("user'1=1test'name", "useremail@example.com", "userpw", "sptoken")
    expect(result["err"]).toBe("not a valid username");
});

test("backend invalid register 2", async () => {
    const result = await BackendFetch.registerUser("userhgegbname", "useremail", "userpw", "sptoken")
    expect(result["err"]).toBe("not a valid email");
});

test("backend valid register 1", async () => {
    const result = await BackendFetch.registerUser("testregister", "testregister@example.com", "testregisterpw", "testregisterspotifytoken")
    expect(result["err"]).toBe(false);
    expect(result["result"]).not.toBe(false);
    expect(result["result"]).not.toBe(true);
});