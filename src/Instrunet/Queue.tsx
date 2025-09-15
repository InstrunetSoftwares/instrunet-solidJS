import { Component, createSignal } from "solid-js";
import { baseUrl, Kind } from "../Singletons";

const QueuePage: Component = () => {
	interface Queue {
		name: string,
		artist: string,
		albumName: string,
		kind: number,
		dataTimeUploaded: string
	}

	const [queueInfo, setQueueInfo] = createSignal<Queue[]>([])
	const [doneLoading, setDoneLoading] = createSignal(false);
	fetch(baseUrl + "queue").then(res => {
		if (res.ok) {
			res.json().then(j => {
				setQueueInfo(j as Queue[])
				setDoneLoading(true);
			})
		}
	})
	return <div class={"bg-base-100  mx-auto mt-10"}>
		<table class={"table-xs sm:min-w-150 border border-base-content/10"}>
			<thead>
				<tr>
					<th class="text-sm font-extralight">Song name</th>
					<th class="text-sm font-extralight">Artist</th>
					<th class="text-sm font-extralight">Album name</th>
					<th class="text-sm font-extralight">Kind</th>
					<th class="text-sm font-extralight">Upload time</th>
				</tr>
			</thead>
			<tbody>
				{
					doneLoading() ? queueInfo().length === 0 ? <tr class={"bg-base-200"}><td colspan={5} class={"text-center"}>空</td></tr> : queueInfo().map((item, index) => <>
						<tr class={index === 0 ? "bg-base-200" : ""}>
							<td>
								{item.name}
							</td>
							<td>
								{item.artist}
							</td>
							<td>
								{item.albumName}
							</td>
							<td>
								{Kind[item.kind]}
							</td>
							<td>
								{item.dataTimeUploaded}
							</td>
						</tr>
					</>) : <tr class={"bg-base-200"}><td colspan={5} class={"text-center"}><span class={"loading loading-spinner loading-md"}></span></td></tr>
				}

			</tbody>

		</table>
	</div>
}
export default QueuePage;