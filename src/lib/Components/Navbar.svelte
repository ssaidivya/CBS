<script>
	import Hamburger from './Humburger.svelte'
	import Menu from './Menu.svelte'
	import avatar from "../../assets/avatar.jpg"
	export let sidebar = false
</script>

<header class="flex justify-between bg-slate-200 p-2 items-center text-gray-600 border-b-2 h-16">
	<nav class="flex">
		<Hamburger bind:open={sidebar}/>
	</nav>
	
	<Menu/>
</header>