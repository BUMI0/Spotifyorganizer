import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import { getByLabelText, getByText, getByTestId, queryByTestId, waitFor,} from '@testing-library/dom'
import '@testing-library/jest-dom'
import Track from "../../components/Track/Track"

test('loads and displays greeting', async () => {
	const test = render(<Track searchResults={[]}
								onAdd={()=> {console.log("Adding")}}
								onRemove={()=> {console.log("Removing")}}
								track={{name:"TestName", artist:"TestArtist", album:"TestAlbum"}} />);
	// <div class="Track"><div class="Track-action"><h3>TestName</h3><p>TestArtist | TestAlbum</p></div><button class="Track-action">+</button></div>
	expect(test.container.innerHTML == '<div class="Track"><div class="Track-action"><h3>TestName</h3><p>TestArtist | TestAlbum</p></div><button class="Track-action">+</button></div>')
})
